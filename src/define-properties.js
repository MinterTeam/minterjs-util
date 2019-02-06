import ethUtil from 'ethereumjs-util';
import {Buffer} from 'safe-buffer';
import assert from 'assert';

const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj; };

/**
 * Defines properties on a `Object`. It make the assumption that underlying data is binary.
 * @param {Object} self the `Object` to define properties on
 * @param {Array} fields an array fields to define. Fields can contain:
 * * `name` - the name of the properties
 * * `length` - the number of bytes the field can have
 * * `allowLess` - if the field can be less than the length
 * * `allowEmpty`
 * * `allowNonBinaryArray` - if the field can be non binary array
 * * `nonBinaryArrayMap` - function to transform each item of the non binary array
 * @param {*} data data to be validated against the definitions
 */
export default function definePropertiesNonBinary(self, fields, data) {
    self.raw = [];
    self._fields = [];

    // attach the `toJSON`
    self.toJSON = function (label) {
        if (label) {
            const obj = {};
            self._fields.forEach((field) => {
                obj[field] = `0x${self[field].toString('hex')}`;
            });
            return obj;
        }
        return ethUtil.baToJSON(this.raw);
    };

    self.serialize = function serialize() {
        return ethUtil.rlp.encode(self.raw);
    };

    fields.forEach((field, i) => {
        self._fields.push(field.name);
        function getter() {
            return self.raw[i];
        }
        function setter(v) {
            if (field.allowNonBinaryArray && Array.isArray(v)) {
                v = v.map((item) => ethUtil.toBuffer(item));
            } else {
                v = ethUtil.toBuffer(v);

                if (v.toString('hex') === '00' && !field.allowZero) {
                    v = Buffer.allocUnsafe(0);
                }

                if (field.allowLess && field.length) {
                    v = ethUtil.stripZeros(v);
                    assert(field.length >= v.length, `The field ${field.name} must not have more ${field.length} bytes`);
                } else if (!(field.allowZero && v.length === 0) && field.length) {
                    assert(field.length === v.length, `The field ${field.name} must have byte length of ${field.length}`);
                }
            }

            self.raw[i] = v;
        }

        Object.defineProperty(self, field.name, {
            enumerable: true,
            configurable: true,
            get: getter,
            set: setter,
        });

        if (field.default) {
            self[field.name] = field.default;
        }

        // attach alias
        if (field.alias) {
            Object.defineProperty(self, field.alias, {
                enumerable: false,
                configurable: true,
                set: setter,
                get: getter,
            });
        }
    });

    // if the constuctor is passed data
    if (data) {
        if (typeof data === 'string') {
            data = Buffer.from(ethUtil.stripHexPrefix(data), 'hex');
        }

        if (Buffer.isBuffer(data)) {
            data = ethUtil.rlp.decode(data);
        }

        if (Array.isArray(data)) {
            if (data.length > self._fields.length) {
                throw new Error('wrong number of fields in data');
            }

            // make sure all the items are buffers
            data.forEach((d, i) => {
                self[self._fields[i]] = ethUtil.toBuffer(d);
            });
        } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
            const keys = Object.keys(data);
            fields.forEach((field) => {
                if (keys.indexOf(field.name) !== -1) self[field.name] = data[field.name];
                if (keys.indexOf(field.alias) !== -1) self[field.alias] = data[field.alias];
            });
        } else {
            throw new Error('invalid data');
        }
    }
}
