import bcript from "bcryptjs";

//! This module provides a Rust implementation of the bcrypt encryption algorithm.
class Bcrypt {
  async compare(value1: string, value2: string): Promise<boolean> {
    try {
      const res = await bcript.compare(value1, value2);
      return res;
    } catch (e) {
      console.error(e);
    }
  }
}

export default new Bcrypt();
