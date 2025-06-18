import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { ReportEntity } from './report.entity';
import { SurveyEntity } from '../survey/survey.entity';
import * as PDFDocument from 'pdfkit-table';
import { format } from 'date-fns';
import { ItemEntity } from '../item/item.entity';
import { ItemTypes } from '@seyconel/config';
import { staticPath } from '../../config/path';
import * as chartistSvg from 'chartist-svg';
import * as SVGtoPDF from 'svg-to-pdfkit';
import * as fs from 'fs';
import * as PDFKit from 'pdfkit';
import * as gs from 'ghostscript4js';
import * as GoogleChartsNode from 'google-charts-node'

@Injectable()
export class ReportService extends TypeOrmCrudService<ReportEntity> {
  counter = 0;
  constructor(
    @Inject('REPORT_REPOSITORY')
    private reportRepository: Repository<ReportEntity>
  ) {
    super(reportRepository);
  }

  colors = {
    dark: '#0d326f',
    cyan: '#0099cc',
    blue: '#0000FF',
    black: '#000000',
  };
  lineWidth = 0.7;

  actualPage = '';
  pageTemplatePage = '';

  sector: string;

  async generate(surveyId: string, ri: string): Promise<SurveyEntity> {
    const surveyRepository = this.reportRepository.manager.getRepository(
      SurveyEntity
    );
    await surveyRepository.update({ id: surveyId }, { completed: true });
    const data = await surveyRepository
      .createQueryBuilder('surveys')
      .leftJoinAndSelect('surveys.customer', 'customer')
      .leftJoinAndSelect('surveys.sectors', 'sectors')
      .leftJoinAndSelect('sectors.items', 'items')
      .leftJoinAndSelect('items.photos', 'photos')
      .select([
        'surveys.id',
        'surveys.name',
        'customer.id',
        'customer.name',
        'customer.cnpj',
        'sectors.id',
        'sectors.name',
        'items.id',
        'items.traceability',
        'items.data',
        'items.approved',
        'photos.id',
        'photos.file',
      ])
      .where({ id: surveyId })
      .getOne();
    if (!data) {
      return;
    }
    await this.reportRepository.save({
      name: data?.name,
      surveyId,
      data,
      ri: Number(ri),
    });
  }

  zeroPad(num: number, places: number) {
    return String(num).padStart(places, '0');
  }

  async pdf(res, reportId: string): Promise<any> {
    const filePath = `${staticPath}/${reportId}.pdf`;
    const filePathSrc = `${staticPath}/${reportId}-src.pdf`;

    try {
      if (fs.existsSync(filePath)) {
        console.log('file exists', filePath);
        const readStream = fs.createReadStream(filePath);
        // This will wait until we know the readable stream is actually valid before piping
        readStream.on('open', function () {
          // This just pipes the read stream to the response object (which goes to the client)
          res.set({
            'Content-Type': 'application/pdf',
          });
          readStream.pipe(res);
        });
        return true;
        //file exists
      }
    } catch (err) {
      console.error(err);
    }

    const report = await this.reportRepository.findOne({where: {id: reportId}});
    const doc = new PDFDocument({
      size: 'A4',
      autoFirstPage: false,
      margins: {
        top: 163,
        bottom: -120,
        left: 0,
        right: 0,
      },
    });

    const reportData = report?.data;
    const sectors = reportData.sectors;

    console.log('setores: ', sectors.length);

    let locals: any = {
      docNumber: `RI-${this.zeroPad(report.ri, 4)}`,
      docDate: format(report.createdAt, 'dd/MM/yy'),
      sectorName: `Acessórios de movimentação e Içamento de carga`,
    };

    let i = 0;
    for (const sector of sectors) {
      if (i === 0) {
        doc.on('pageAdded', async (evt) => {
          await this.pageTemplate(doc, locals);
        });
      }
      i++;
      console.log('setor: ', i);

      const items = sector?.items ? [...sector.items] : [];

      console.log('items: ', items.length);

      if (items.length > 0) {
        this.sector = sector;
        this.actualPage = 'sectorPage';
        doc.addPage();
        locals = {
          ...locals,
          docDate: format(report.createdAt, 'dd/MM/yy'),
          sectorName: sector?.name,
          items,
        };
        await this.sectorPage(doc, locals);

        for (const item of items) {
          this.actualPage = 'itemPage';
          doc.addPage();

          const itemType = ItemTypes.find(
            (it) => it.itemType === item?.data?.type
          );
          locals = {
            ...locals,
            photos: item?.photos,
            content: itemType.renderContent(item, sector),
            approved: item?.approved,
          };
          await this.itemPage(doc, locals);
        }
      }
    }
    console.log('document done');
    /*res.set({
      'Content-Type': 'application/pdf',
    });
    doc.pipe(res);*/
    res.set({
      'Content-Type': 'application/pdf',
    });

    doc.pipe(fs.createWriteStream(filePathSrc)).on('finish', () => {
      console.log('PDF writed', filePathSrc);

      this.compressAndMove(reportId);
    });

    doc.pipe(res);

    // Close PDF and write file.

    doc.end();
  }

  async compressAndMove(id: string) {
    // Take decision based on Ghostscript version
    const version = gs.version();
    console.log(version);
    gs.executeSync(
      `-sDEVICE=pdfwrite -dPDFSETTINGS=/printer -o ${staticPath}/${id}.pdf -sDEVICE=pdfwrite -r70 ${staticPath}/${id}-src.pdf`
    );

    fs.rmSync(`${staticPath}/${id}-src.pdf`);
  }

  async pageTemplate(doc: typeof PDFKit, locals: any) {
    if (
      this.actualPage === 'sectorPage' &&
      this.pageTemplatePage === 'sectorPage'
    ) {
      doc
        .fontSize(24)
        .font('Helvetica')
        .fillColor(this.colors.black)
        .text(`${locals.sectorName}`, 50, 120, {
          width: 500,
          align: 'center',
          lineGap: 15,
        });
    }
    this.pageTemplatePage = this.actualPage;
    const width = 594.5;
    const height = 840;
    const margin = 23;
    let points = [margin, margin, height - margin, width - margin];
    const path = __dirname;
    doc.image(`${path}/assets/logo.png`, 42, 31, { width: 105 });
    doc.font('Helvetica');
    doc
      .polygon(
        [points[0], points[1]],
        [points[0], points[2]],
        [points[3], points[2]],
        [points[3], points[1]]
      )
      .lineWidth(this.lineWidth)
      .stroke(this.colors.dark);
    const height2 = 110;
    points = [
      margin * 2 + 1,
      margin + 2 + margin / 2,
      height2 - margin,
      width - margin * 2,
    ];
    doc
      .polygon(
        [points[0], points[1]],
        [points[0], points[2]],
        [points[3], points[2]],
        [points[3], points[1]]
      )
      .lineWidth(this.lineWidth)
      .stroke(this.colors.dark);
    points[0] = 142;
    doc
      .polygon([points[0], points[1]], [points[0], points[2]])
      .lineWidth(this.lineWidth)
      .stroke(this.colors.dark);
    points[0] = 450;
    doc
      .polygon([points[0], points[1]], [points[0], points[2]])
      .stroke(this.colors.dark);
    points[0] = 496.5;
    doc
      .polygon([points[0], points[1]], [points[0], points[2]])
      .stroke(this.colors.dark);
    points[0] = 142;
    doc
      .polygon([points[0], 62], [points[3], 62])
      .lineWidth(this.lineWidth)
      .stroke(this.colors.dark);
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(this.colors.dark)
      .text(
        'RELATÓRIO DE INSPEÇÃO – DEPARTAMENTO DE ENGENHARIA',
        points[0],
        46,
        {
          width: 308,
          align: 'center',
        }
      );
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(this.colors.dark)
      .text(`${locals.sectorName}`.toLocaleUpperCase(), points[0], 71, {
        width: 308,
        align: 'center',
      });
    doc
      .fontSize(9)
      .fillColor(this.colors.dark)
      .font('Helvetica-Bold')
      .text('Nº DOC:', 450, 46, {
        width: 47,
        align: 'center',
      });
    doc
      .fontSize(9)
      .fillColor(this.colors.dark)
      .font('Helvetica-Bold')
      .text('DATA:', 450, 71, {
        width: 47,
        align: 'center',
      });
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor(this.colors.blue)
      .text(`${locals.docNumber}`, 496, 46, {
        width: 52,
        align: 'center',
      });

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor(this.colors.cyan)
      .text(`${locals.docDate}`, 496, 71, {
        width: 52,
        align: 'center',
      });
  }

  async itemPage(doc: typeof PDFKit, locals: any) {
    console.log('itemPage', this.counter++);

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor(this.colors.black)
      .text(`${locals.content[0]}`, 60, 110, {
        width: 480,
        align: 'left',
        lineGap: 6,
      });
    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor(this.colors.black)
      .text(`${locals.content[1]}`, 60, 110, {
        width: 480,
        align: 'right',
        lineGap: 6,
      });

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor(this.colors.black)
      .text(
        `( ${locals?.approved ? 'X' : ' '} ) APROVADO      ( ${!locals?.approved ? 'X' : ' '} ) REPROVADO`,
        60,
        360,
        {
          width: 500,
          align: 'left',
          lineGap: 0,
        }
      );

    if (locals?.photos && locals?.photos.length > 0) {
      let y = 60;
      let imageY = y + 10;
      let points = [47, 760, y, 548.5];

      const photoGroups: any[] = locals?.photos.reduce(
        (r, e, i) => (i % 4 ? r[r.length - 1].push(e) : r.push([e])) && r,
        []
      );
      for (const [k, photos] of photoGroups.entries()) {
        y += 364;
        if (k % 2 === 1) {
          doc.addPage();
          y = 90;
        }
        imageY = y + 10;
        points = [47, 360 + y, y, 548.5];
        doc
          .polygon(
            [points[0], points[1]],
            [points[0], points[2]],
            [points[3], points[2]],
            [points[3], points[1]]
          )
          .lineWidth(this.lineWidth)
          .stroke(this.colors.dark);

        switch (photos.length) {
          case 1:
            doc.image(`${staticPath}/${photos[0].file}`, 57, imageY, {
              width: 480,
              height: 340,
              cover: [480, 340],
              fit: [480, 340],
              align: 'center',
              valign: 'center',
            });
            break;
          case 2:
            doc.image(`${staticPath}/${photos[0].file}`, 57, imageY, {
              width: 240,
              height: 340,
              align: 'center',
              valign: 'center',
              fit: [240, 340],
            });
            doc.image(`${staticPath}/${photos[1].file}`, 297, imageY, {
              width: 240,
              height: 340,
              fit: [240, 340],
              align: 'center',
              valign: 'center',
            });
            break;
          case 3:
            doc.image(`${staticPath}/${photos[0].file}`, 57, imageY, {
              width: 240,
              height: 340,
              align: 'center',
              valign: 'center',
              fit: [240, 340],
            });
            doc.image(`${staticPath}/${photos[1].file}`, 297, imageY, {
              width: 240,
              height: 190,
              cover: [240, 170],
              fit: [240, 170],
              align: 'center',
              valign: 'center',
            });
            doc.image(`${staticPath}/${photos[2].file}`, 297, imageY + 170, {
              width: 240,
              height: 340,
              cover: [240, 170],
              fit: [240, 170],
              align: 'center',
              valign: 'center',
            });
            break;
          case 4:
            doc.image(`${staticPath}/${photos[0].file}`, 57, imageY, {
              width: 240,
              height: 170,
              cover: [240, 170],
              fit: [240, 170],
              align: 'center',
              valign: 'center',
            });
            doc.image(`${staticPath}/${photos[1].file}`, 57, imageY + 170, {
              width: 240,
              height: 170,
              cover: [240, 170],
              fit: [240, 170],
              align: 'center',
              valign: 'center',
            });
            doc.image(`${staticPath}/${photos[2].file}`, 297, imageY, {
              width: 240,
              height: 170,
              cover: [240, 170],
              fit: [240, 170],
              align: 'center',
              valign: 'center',
            });
            doc.image(`${staticPath}/${photos[3].file}`, 297, imageY + 170, {
              width: 240,
              height: 170,
              cover: [240, 170],
              fit: [240, 170],
              align: 'center',
              valign: 'center',
            });
            break;
        }
      }
    }
  }

  async sectorPage(doc: PDFDocument, locals: any) {
    console.log('sectorPage: ', locals?.sectorName);

    doc
      .fontSize(24)
      .font('Helvetica')
      .fillColor(this.colors.black)
      .text(`${locals.sectorName}`, 50, 120, {
        width: 500,
        align: 'center',
        lineGap: 15,
      });

    const table = {
      headers: [
        { label: 'Num. Rastreio', headerColor: 'yellow', headerOpacity: 1 },
        { label: 'Descrição', headerColor: 'yellow', headerOpacity: 1 },
        { label: 'Capacidade', headerColor: 'yellow', headerOpacity: 1 },
        { label: 'Comprimento', headerColor: 'yellow', headerOpacity: 1 },
        { label: 'Situação', headerColor: 'yellow', headerOpacity: 1 },
      ],
      rows: locals.items.map((item: Partial<ItemEntity>) => {
        return [
          item?.traceability,
          item?.data?.description,
          item?.data?.capacity
            ? item?.data?.capacity
            : item?.data?.capacity_select
            ? item?.data?.capacity_select
            : item?.data?.capacity_auto,
          item?.data?.length,
          item?.approved ? 'Aprovado' : 'Reprovado',
        ];
      }),
    };

    doc.table(table, {
      width: 500,
      columnsSize: [80, 210, 80, 80, 50],
      // y: 0,
    });

    const { aprovados, reprovados } = locals.items.reduce(
      (acc, each) => {
        if (each.approved) {
          acc.aprovados++;
        } else {
          acc.reprovados++;
        }
        return acc;
      },
      { aprovados: 0, reprovados: 0 }
    );

    //const barsSvg = await this.generateBars(aprovados, reprovados);
    //const pieSvg = await this.generatePie(aprovados, reprovados);

    let y = doc.y + 10;
    if (doc.y > 600) {
      doc.addPage();
      y = 200;
    }
    //SVGtoPDF(doc, barsSvg, 75, y);
    //SVGtoPDF(doc, pieSvg, 325, y);
    const image = await this.generateImageChart2(aprovados, reprovados);
    doc.image(image, 50, y, {
      width: 500,
      height: 250,
      align: 'center',
      valign: 'center',
    });

    const image2 = await this.generateImageChart(aprovados, reprovados);
    doc.image(image2, 50, y + 280, {
      width: 500,
      height: 250,
      align: 'center',
      valign: 'center',
    });
  }

  async generateImageChart(aprovados: number, reprovados: number){
    const drawChartStr = `
      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', '');
      data.addColumn('number', '');
      data.addRows([
        ['Aprovados', ${aprovados}],
        ['Reprovados', ${reprovados}],
      ]);
      // Set chart options
      var options = { title: 'Gráfico de conclusão' };
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    `;
    const image = await GoogleChartsNode.render(drawChartStr, {
      width: 500,
      height: 250,
    });
    return image;
  }

  async generateImageChart2(aprovados: number, reprovados: number){
    const drawChartStr = `
      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', '');
      data.addColumn('number', '');
      data.addRows([
        ['Total', ${aprovados + reprovados}],
        ['Aprovados', ${aprovados}],
        ['Reprovados', ${reprovados}],
      ]);
      // Set chart options
      var options = { title: 'Gráfico de conclusão' };
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    `;
    const image = await GoogleChartsNode.render(drawChartStr, {
      width: 500,
      height: 250,
    });
    return image;
  }


  generateBars(aprovados: number, reprovados: number) {
    const data = {
      labels: ['Total', 'Aprovados', 'Reprovados'],
      series: [[aprovados + reprovados, aprovados, reprovados]],
    };
    const options = {
      chart: {
        width: 250,
        height: 250,
        axisY: {
          onlyInteger: true,
        },
      },
      width: 250,
      height: 250,

    };
    const opts = {
      ...options,
      css: `.ct-series-a .ct-bar:nth-child(1) {
        stroke: blue;
        stroke-width: 30px
      }
      .ct-series-a .ct-bar:nth-child(2) {
        stroke: green;
        stroke-width: 30px
      }
      .ct-series-a .ct-bar:nth-child(3) {
        stroke: red;
        stroke-width: 30px
      }
      `,
    };
    return chartistSvg('bar', data);
  }

  generatePie(aprovados: number, reprovados: number) {
    const data = {
      labels: ['Aprovados', 'Reprovados'],
      series: [[aprovados, reprovados]],
    };
    const options = {
      width: 250,
      height: 250,
      labelInterpolationFnc: function (label, i) {
        const value = data.series[0][i];
        if (value === 0) {
          return '';
        }
        const pct = Math.round((value / (aprovados + reprovados)) * 100) + '%';
        return `${label}: ${pct}`;
      },
    };
    const opts = {
      options: options,
      css: `
      .ct-series-a .ct-slice-pie {
        fill: green;
      }
      .ct-series-b .ct-slice-pie {
        fill: red;
      }`,
    };
    return chartistSvg('pie', data);
  }
}
