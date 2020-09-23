/* eslint-disable unicorn/no-null */

import * as minterUtil from '~/src';

describe('mPrefixToHex()', () => {
    test('should work', () => {
        expect(minterUtil.mPrefixToHex('Mx2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe('0x2f015c60e0be116b1f0cd534704db9c92118fb6a');
        expect(minterUtil.mPrefixToHex('Mh4eacb2e4bcc0514d5526895f4f699acf543081d2')).toBe('0x4eacb2e4bcc0514d5526895f4f699acf543081d2');
    });
});

describe('mPrefixStrip()', () => {
    test('should work', () => {
        expect(minterUtil.mPrefixStrip('Mx2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe('2f015c60e0be116b1f0cd534704db9c92118fb6a');
        expect(minterUtil.mPrefixStrip('Mh4eacb2e4bcc0514d5526895f4f699acf543081d2')).toBe('4eacb2e4bcc0514d5526895f4f699acf543081d2');
    });
});

describe('isValidAddress()', () => {
    test('should work with address', () => {
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(true);
        expect(minterUtil.isValidAddress('Mx52908400098527886E0F7030069857D2E4169EE7')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6')).toBe(false);
        expect(minterUtil.isValidAddress('Mx2f015c60e0be116b1f0cd534704db9c92118fb6aa')).toBe(false);
        expect(minterUtil.isValidAddress('MX52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
        expect(minterUtil.isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
    });
});

describe('isValidCheck()', () => {
    test('should work with check', () => {
        expect(minterUtil.isValidCheck('Mcf89b01830f423f8a4d4e5400000000000000843b9aca00b8419b3beac2c6ad88a8bd54d24912754bb820e58345731cb1b9bc0885ee74f9e50a58a80aa990a29c98b05541b266af99d3825bb1e5ed4e540c6e2f7c9b40af9ecc011ca0387fd67ec41be0f1cf92c7d0181368b4c67ab07df2d2384192520d74ff77ace6a04ba0e7ad7b34c64223fe59584bc464d53fcdc7091faaee5df0451254062cfb37')).toBe(true);
        expect(minterUtil.isValidCheck('Mc00')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isValidCheck('2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidCheck('MC52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
        expect(minterUtil.isValidCheck('Mc')).toBe(false);
        expect(minterUtil.isValidCheck('x2f015c60e0be116b1f0cd534704db9c92118fb6a')).toBe(false);
        expect(minterUtil.isValidCheck('0x52908400098527886E0F7030069857D2E4169EE7')).toBe(false);
    });
});

describe('isValidTransaction()', () => {
    test('should work with check', () => {
        expect(minterUtil.isValidTransaction('Mtbf2c75192768b8843d456bf74056e415f2f692c926b9b05354182e7e4ee8d1d8')).toBe(true);
        expect(minterUtil.isValidTransaction('MtBF2C75192768B8843D456BF74056E415F2F692C926B9B05354182E7E4EE8D1D8')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isValidTransaction('Mtbf2c75192768b8843d456bf74056e415f2f692c926b9b05354182e7e4ee8d1d')).toBe(false);
        expect(minterUtil.isValidTransaction('Mtbf2c75192768b8843d456bf74056e415f2f692c926b9b05354182e7e4ee8d1d88')).toBe(false);
        expect(minterUtil.isValidTransaction('bf2c75192768b8843d456bf74056e415f2f692c926b9b05354182e7e4ee8d1d8')).toBe(false);
        expect(minterUtil.isValidTransaction('MTbf2c75192768b8843d456bf74056e415f2f692c926b9b05354182e7e4ee8d1d8')).toBe(false);
        expect(minterUtil.isValidTransaction('Mt')).toBe(false);
        expect(minterUtil.isValidTransaction('xbf2c75192768b8843d456bf74056e415f2f692c926b9b05354182e7e4ee8d1d8')).toBe(false);
        expect(minterUtil.isValidTransaction('0xbf2c75192768b8843d456bf74056e415f2f692c926b9b05354182e7e4ee8d1d8')).toBe(false);
    });
});

describe('isValidPublicKeyString()', () => {
    test('should work with public key', () => {
        expect(minterUtil.isValidPublicKeyString('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(true);
        expect(minterUtil.isValidPublicKeyString('Mp0000000000000000000000000000000000000000000000000000000000000000')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isValidPublicKeyString('28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f41054')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f4105440')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('MP28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isValidPublicKeyString('0x28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
    });
});

describe('isMinterPrefixed()', () => {
    test('should work with minter prefix', () => {
        expect(minterUtil.isMinterPrefixed('Mp28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mc52908400098527886E0F7030069857D2E4169EE7')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mx7633980c000139dd3bd24a3f54e06474fa941e16')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mh4eacb2e4bcc0514d5526895f4f699acf543081d2')).toBe(true);
        expect(minterUtil.isMinterPrefixed('Mtc56ed8f53fa370b33b2b36764171d10a2259d807')).toBe(true);
    });
    test('should fail on invalid input', () => {
        expect(minterUtil.isMinterPrefixed('28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isMinterPrefixed('Mpxx')).toBe(false);
        expect(minterUtil.isMinterPrefixed('MP28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
        expect(minterUtil.isMinterPrefixed('0x28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544')).toBe(false);
    });
});

describe('mToBuffer()', () => {
    test('should work with address', () => {
        const address = minterUtil.mToBuffer('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
        const buf = Buffer.from('7633980c000139dd3bd24a3f54e06474fa941e16', 'hex');
        expect(address).toEqual(buf);
    });
    test('should throw with not string', () => {
        expect(() => {
            minterUtil.mToBuffer(null);
        }).toThrow();
    });
    test('should throw with wrong prefix', () => {
        expect(() => {
            minterUtil.mToBuffer('0x28c07651a5e9ee18d746aa322967afb0f6af6f1d614e1c0226e40d392f410544');
        }).toThrow();
    });
});

describe('toBuffer()', () => {
    test('should work with null', () => {
        const address = minterUtil.toBuffer(null).toString('hex');
        const buf = Buffer.from([]).toString('hex');
        expect(address).toEqual(buf);
    });
    test('should work with address', () => {
        const address = minterUtil.toBuffer('Mx2f015c60e0be116b1f0cd534704db9c92118fb6a').toString('hex');
        const buf = '2f015c60e0be116b1f0cd534704db9c92118fb6a';
        expect(address).toEqual(buf);
    });
});

describe('addressToString()', () => {
    test('should work with Buffer address', () => {
        const address = Buffer.from('7633980c000139dd3bd24a3f54e06474fa941e16', 'hex');
        expect(minterUtil.addressToString(address)).toEqual('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
    });
    test('should work with 0x address', () => {
        const address = '0x7633980c000139dd3bd24a3f54e06474fa941e16';
        expect(minterUtil.addressToString(address)).toEqual('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
    });
});

describe('checkToString()', () => {
    const checkHex = 'f8a03101830f423f8a4d4e5400000000000000888ac7230489e80000b84149eba2361855724bbd3d20eb97a54ea15ad7dc28c1111b8dcf3bb15db26f874f095803cad9f8fc88b2b4eec9ba706325a7929be31b6ccfef01260791a844cb55011ba06c63ad17bfe07b82be8a0144fd4daf8b4144281fdf88f313205ceacf37fd877fa03c243ad79cab6205f4b753bd402c4cfa5d570888659090b2f923071ac52bdf75';
    test('should work with Buffer check', () => {
        const check = Buffer.from(checkHex, 'hex');
        expect(minterUtil.checkToString(check)).toEqual(`Mc${checkHex}`);
    });
    test('should work with 0x check', () => {
        const check = `0x${checkHex}`;
        expect(minterUtil.checkToString(check)).toEqual(`Mc${checkHex}`);
    });
});

describe('privateToAddressString()', () => {
    test('should work with Buffer private key', () => {
        const address = minterUtil.privateToAddressString(Buffer.from('5fa3a8b186f6cc2d748ee2d8c0eb7a905a7b73de0f2c34c5e7857c3b46f187da', 'hex'));
        expect(address).toEqual('Mx7633980c000139dd3bd24a3f54e06474fa941e16');
    });
});
