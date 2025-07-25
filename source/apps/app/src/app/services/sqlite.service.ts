import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
  capSQLiteSet,
  capSQLiteChanges,
  capSQLiteValues,
  capEchoResult,
  capSQLiteResult,
} from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class SQLiteService {
  sqlite!: SQLiteConnection;
  isService = false;
  platform!: string;
  sqlitePlugin?: any;
  native = false;

  constructor() {}
  /**
   * Plugin Initialization
   */
  initializePlugin(): Promise<boolean> {
    return new Promise((resolve) => {
      this.platform = Capacitor.getPlatform();
      if (this.platform === 'ios' || this.platform === 'android')
        this.native = true;
      this.sqlitePlugin = CapacitorSQLite;
      this.sqlite = new SQLiteConnection(this.sqlitePlugin);
      this.isService = true;
      resolve(true);
    });
  }
  /**
   * Echo a value
   * @param value
   */
  async echo(value: string): Promise<capEchoResult> {
    if (this.sqlite != null) {
      try {
        const ret = await this.sqlite.echo(value);
        return Promise.resolve(ret);
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error('no connection open'));
    }
  }
  async isSecretStored(): Promise<capSQLiteResult> {
    if (!this.native) {
      return Promise.reject(
        new Error(`Not implemented for ${this.platform} platform`)
      );
    }
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isSecretStored());
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  async setEncryptionSecret(passphrase: string): Promise<void> {
    if (!this.native) {
      return Promise.reject(
        new Error(`Not implemented for ${this.platform} platform`)
      );
    }
    if (this.sqlite != null) {
      try {
        return Promise.resolve(
          await this.sqlite.setEncryptionSecret(passphrase)
        );
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  async changeEncryptionSecret(
    passphrase: string,
    oldpassphrase: string
  ): Promise<void> {
    if (!this.native) {
      return Promise.reject(
        new Error(`Not implemented for ${this.platform} platform`)
      );
    }
    if (this.sqlite != null) {
      try {
        return Promise.resolve(
          await this.sqlite.changeEncryptionSecret(passphrase, oldpassphrase)
        );
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  /**
   * addUpgradeStatement
   * @param database
   * @param fromVersion
   * @param toVersion
   * @param statement
   * @param set
   */
  async addUpgradeStatement(
    database: string,
    fromVersion: number,
    toVersion: number,
    statement: string[],
    set?: capSQLiteSet[]
  ): Promise<void> {
    if (this.sqlite != null) {
      try {
        await this.sqlite.addUpgradeStatement(
          database,
          toVersion,
          statement,
        );
        return Promise.resolve();
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Create a connection to a database
   * @param database
   * @param encrypted
   * @param mode
   * @param version
   */
  async createConnection(
    database: string,
    encrypted: boolean,
    mode: string,
    version: number
  ): Promise<SQLiteDBConnection> {
    if (this.sqlite != null) {
      try {
        const db: SQLiteDBConnection = await this.sqlite.createConnection(
          database,
          encrypted,
          mode,
          version,
          false
        );
        if (db != null) {
          return Promise.resolve(db);
        } else {
          return Promise.reject(new Error(`no db returned is null`));
        }
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Close a connection to a database
   * @param database
   */
  async closeConnection(database: string): Promise<void> {
    if (this.sqlite != null) {
      try {
        await this.sqlite.closeConnection(database, false);
        return Promise.resolve();
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Retrieve an existing connection to a database
   * @param database
   */
  async retrieveConnection(database: string): Promise<SQLiteDBConnection> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.retrieveConnection(database, false));
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Retrieve all existing connections
   */
  async retrieveAllConnections(): Promise<Map<string, SQLiteDBConnection>> {
    if (this.sqlite != null) {
      try {
        const myConns = await this.sqlite.retrieveAllConnections();
        return Promise.resolve(myConns);
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Close all existing connections
   */
  async closeAllConnections(): Promise<void> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.closeAllConnections());
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Check if connection exists
   * @param database
   */
  async isConnection(database: string): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isConnection(database, false));
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Check Connections Consistency
   * @returns
   */
  async checkConnectionsConsistency(): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        const res = await this.sqlite.checkConnectionsConsistency();
        return Promise.resolve(res);
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Check if database exists
   * @param database
   */
  async isDatabase(database: string): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isDatabase(database));
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Get the list of databases
   */
  async getDatabaseList(): Promise<capSQLiteValues> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.getDatabaseList());
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Delete old databases
   */
  async getMigratableDbList(folderPath?: string): Promise<capSQLiteValues> {
    if (!this.native) {
      return Promise.reject(
        new Error(`Not implemented for ${this.platform} platform`)
      );
    }
    if (this.sqlite != null) {
      try {
        if (!folderPath || folderPath.length === 0) {
          return Promise.reject(new Error(`You must provide a folder path`));
        }
        return Promise.resolve(
          await this.sqlite.getMigratableDbList(folderPath)
        );
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  /**
   * Add "SQLite" suffix to old database's names
   */
  async addSQLiteSuffix(
    folderPath?: string,
    dbNameList?: string[]
  ): Promise<void> {
    if (!this.native) {
      return Promise.reject(
        new Error(`Not implemented for ${this.platform} platform`)
      );
    }
    if (this.sqlite != null) {
      try {
        const path: string = folderPath ? folderPath : 'default';
        const dbList: string[] = dbNameList ? dbNameList : [];
        return Promise.resolve(await this.sqlite.addSQLiteSuffix(path, dbList));
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Delete old databases
   */
  async deleteOldDatabases(
    folderPath?: string,
    dbNameList?: string[]
  ): Promise<void> {
    if (!this.native) {
      return Promise.reject(
        new Error(`Not implemented for ${this.platform} platform`)
      );
    }
    if (this.sqlite != null) {
      try {
        const path: string = folderPath ? folderPath : 'default';
        const dbList: string[] = dbNameList ? dbNameList : [];
        return Promise.resolve(
          await this.sqlite.deleteOldDatabases(path, dbList)
        );
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  /**
   * Import from a Json Object
   * @param jsonstring
   */
  async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.importFromJson(jsonstring));
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  /**
   * Is Json Object Valid
   * @param jsonstring Check the validity of a given Json Object
   */

  async isJsonValid(jsonstring: string): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isJsonValid(jsonstring));
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  /**
   * Copy databases from public/assets/databases folder to application databases folder
   */
  async copyFromAssets(overwrite?: boolean): Promise<void> {
    const mOverwrite: boolean = overwrite != null ? overwrite : true;
    console.log(`&&&& mOverwrite ${mOverwrite}`);
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.copyFromAssets(mOverwrite));
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Initialize the Web store
   * @param database
   */
  async initWebStore(): Promise<void> {
    console.log('initWebStore() sqliteservice')
    if (this.platform !== 'web') {
      return Promise.reject(
        new Error(`not implemented for this platform: ${this.platform}`)
      );
    }
    if (this.sqlite != null) {
      try {
        console.log('pre')
        await this.sqlite.initWebStore();
        console.log('pos')
        return Promise.resolve();
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Save a database to store
   * @param database
   */
  async saveToStore(database: string): Promise<void> {
    if (this.platform !== 'web') {
      return Promise.reject(
        new Error(`not implemented for this platform: ${this.platform}`)
      );
    }
    if (this.sqlite != null) {
      try {
        await this.sqlite.saveToStore(database);
        return Promise.resolve();
      } catch (err: any) {
        return Promise.reject(new Error(err.toString()));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
}
