// auth checker
import { Pool } from 'pg';
import Database from '../core/database';
import User from '../types/user';


class AuthCheckModel {
  pool: Pool;
  constructor() {
    this.pool = new Database().pool;
  }

  async checkSong(songId: number, userId: number) {
    const result = await this.pool.query(
      `SELECT * FROM songs WHERE song_id = $1 AND penyanyi_id = $2`,
      [songId, userId]
    );
    if (result.rows[0]) {
      return true;
    } else {
      return false;
    }
  }
}

export default AuthCheckModel;