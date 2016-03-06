(function() {
  var NewtonDes, _;

  _ = require('lodash');


  /**
    Password verification is done in dock session. A key is sent and received
    encrypted using the password. The encryption used is DES. It seems that
    Newton doesn't use standard DES. (http://newtontalk.newtontalk.narkive.com/U6dNGqJw/newton-dock-password).
  
    So it uses it's own implementation of DES. This is the NodeJS version
    of the two implementations I have found:
      - Ruby:
      https://github.com/ekoeppen/RDCL/blob/master/utils/des.rb
      - Ruby version is based in other C++ version:
      http://klibs.cvs.sourceforge.net/viewvc/klibs/K/K/Crypto/
   */

  module.exports = NewtonDes = (function() {
    var DEFAULT_KEY, E, IP, IPinv, NEWTON_DEFAULT_KEY, P, PC1, PC2, S, SHIFTS;

    function NewtonDes() {}

    DEFAULT_KEY = 0x4cc7618a9849c4e6;

    NEWTON_DEFAULT_KEY = 0x57406860626D7464;

    PC1 = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4];

    PC2 = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];

    IP = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7];

    E = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];

    SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

    S = [[[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7], [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8], [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0], [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]], [[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10], [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5], [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15], [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]], [[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8], [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1], [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7], [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]], [[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15], [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9], [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4], [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]], [[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9], [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6], [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14], [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]], [[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11], [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8], [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6], [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]], [[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1], [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6], [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2], [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]], [[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7], [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2], [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8], [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]]];

    P = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];

    IPinv = [40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25];


    /**
    @property k
     */

    NewtonDes.prototype.k = null;

    NewtonDes.prototype.initialize = function() {};

    NewtonDes.prototype.left_shift = function(number, bits) {
      var desp;
      desp = Array(bits + 1).join('0');
      return parseInt(number.toString(2) + desp, 2);
    };

    NewtonDes.prototype.set_key = function(key) {
      var c, c0, d, d0, i, j, k, k_temp, key_flipped, m, o, p, permutated_key, q, ref, results, s, t;
      console.log("set_key " + key);
      key_flipped = 0;
      for (i = k = 0; k <= 63; i = ++k) {
        key_flipped = key_flipped | (key[i] << (63 - i));
      }
      console.log("key_flipped " + key_flipped);
      permutated_key = [];
      for (i = m = 0; m <= 55; i = ++m) {
        permutated_key[i] = key_flipped[PC1[i] - 1];
      }
      c = [];
      d = [];
      c[0] = permutated_key.slice(0, 28);
      d[0] = permutated_key.slice(28, 56);
      for (i = o = 1; o <= 16; i = ++o) {
        c[i] = _.clone(c[i - 1]);
        d[i] = _.clone(d[i - 1]);
        for (s = p = 1, ref = SHIFTS[i - 1]; 1 <= ref ? p <= ref : p >= ref; s = 1 <= ref ? ++p : --p) {
          c0 = c[i][0];
          d0 = d[i][0];
          for (j = q = 0; q <= 26; j = ++q) {
            c[i][j] = c[i][j + 1];
            d[i][j] = d[i][j + 1];
          }
          c[i][27] = c0;
          d[i][27] = d0;
        }
      }
      this.k = [];
      results = [];
      for (i = t = 0; t <= 15; i = ++t) {
        k_temp = c[i + 1] + d[i + 1];
        this.k[i] = Array.apply(null, Array(48)).map(Number.prototype.valueOf, 0);
        results.push((function() {
          var results1, u;
          results1 = [];
          for (j = u = 0; u <= 47; j = ++u) {
            results1.push(this.k[i][j] = k_temp[PC2[j] - 1]);
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    NewtonDes.prototype.set_newton_key = function(key) {
      var data, desp, high, keyValue, low, tmp_key;
      console.log(" ");
      console.log("set_newton_key");
      console.log(key);
      low = key.readInt32BE(4);
      high = key.readInt32BE(0);
      console.log("low -> " + low);
      console.log("high -> " + high);
      low = this.left_shift(low, 1);
      high = this.left_shift(high, 1);
      console.log("low << -> " + low);
      console.log("high << -> " + high);
      desp = "00000000000000000000000000000000";
      console.log(" ");
      keyValue = "" + (parseInt(high.toString(2) + desp, 2) + low);
      this.set_key(keyValue);
      data = 0;
      tmp_key = this.encrypt_block(data);
      console.log("tmp_key " + tmp_key);
      key = tmp_key | this.fix_parity(tmp_key, true);
      console.log("key " + key);
      low = key & 0x00000000ffffffff;
      high = (key & 0xffffffff00000000) >> 32;
      low <<= 1;
      high <<= 1;
      return this.set_key((high << 32) + low);
    };

    NewtonDes.prototype.fix_parity = function(data, even) {
      var i, j, k, m, n, ref;
      for (i = k = 0, ref = data.size; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        n = 0;
        for (j = m = 1; m <= 7; j = ++m) {
          n += data[i * 8 + j];
        }
        if (n % 2 === (even != null ? even : {
          0: 1
        })) {
          data |= 1 << (i * 8);
        } else {
          data &= ~(1 << (i * 8));
        }
      }
      return data;
    };

    NewtonDes.prototype.encrypt_block = function(block) {
      return this.process_block(block, true);
    };

    NewtonDes.prototype.decrypt_block = function(block) {
      return this.process_block(block, false);
    };

    NewtonDes.prototype.process_block = function(data, encrypt) {
      var b, b_x, b_y, data_flipped, e, f, final, h, i, j, k, l, m, o, output, output_bin, output_bin_flipped, p, permutated_data, q, r, s, s_sub, t, u, v, w, x;
      data_flipped = 0;
      for (i = k = 0; k <= 63; i = ++k) {
        data_flipped = data_flipped | (data[i] << (63 - i));
      }
      permutated_data = Array.apply(null, Array(64)).map(Number.prototype.valueOf, 0);
      for (i = m = 0; m <= 63; i = ++m) {
        permutated_data[i] = data_flipped[IP[i] - 1];
      }
      l = [];
      r = [];
      b = [];
      l[0] = permutated_data.slice(0, 32);
      r[0] = permutated_data.slice(32, 64);
      for (i = o = 1; o <= 16; i = ++o) {
        l[i] = _.clone(r[i - 1]);
        r[i] = _.clone(l[i - 1]);
        e = Array.apply(null, Array(48)).map(Number.prototype.valueOf, 0);
        for (j = p = 0; p <= 47; j = ++p) {
          if (encrypt) {
            e[j] = r[i - 1][E[j] - 1] ^ this.k[i - 1][j];
          } else {
            e[j] = r[i - 1][E[j] - 1] ^ this.k[15 - (i - 1)][j];
          }
        }
        s = Array.apply(null, Array(32)).map(Number.prototype.valueOf, 0);
        for (j = q = 0; q <= 7; j = ++q) {
          b[j] = e.slice(j * 6, +((j * 6) + 5) + 1 || 9e9);
          b_y = (b[j][0] << 1) + b[j][5];
          b_x = (b[j][1] << 3) + (b[j][2] << 2) + (b[j][3] << 1) + b[j][4];
          s_sub = S[j][b_y][b_x];
          for (h = t = 0; t <= 3; h = ++t) {
            s[j * 4 + h] = s_sub[3 - h];
          }
        }
        f = Array.apply(null, Array(32)).map(Number.prototype.valueOf, 0);
        for (j = u = 0; u <= 31; j = ++u) {
          f[j] = s[P[j] - 1];
        }
        for (j = v = 0; v <= 31; j = ++v) {
          r[i][j] = f[j] ^ l[i - 1][j];
        }
      }
      final = r[16] + l[16];
      output = Array.apply(null, Array(64)).map(Number.prototype.valueOf, 0);
      output_bin = 0;
      for (i = w = 0; w <= 63; i = ++w) {
        output[i] = final[IPinv[i] - 1];
        output_bin = output_bin | (output[i] << i);
      }
      output_bin_flipped = 0;
      for (i = x = 0; x <= 63; i = ++x) {
        output_bin_flipped = output_bin_flipped | (output_bin[i] << (63 - i));
      }
      return output_bin_flipped;
    };

    NewtonDes.prototype.bits_to_s = function(bits, mod) {
      var i, k, r, ref;
      r = "";
      for (i = k = 0, ref = bits.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        r += (bits[i] + 48).chr;
        if ((i + 1) % mod === 0) {
          r += 32..chr;
        }
      }
      return r;
    };

    NewtonDes.prototype.to_bin = function(bits, flip) {
      var j, k, output_bin, ref;
      if (flip == null) {
        flip = false;
      }
      output_bin = 0;
      for (j = k = 0, ref = bits.length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
        if (flip) {
          output_bin = output_bin | (bits[j] << (bits.length - 1 - j));
        } else {
          output_bin = output_bin | (bits[j] << j);
        }
      }
      return output_bin;
    };

    return NewtonDes;

  })();

}).call(this);
