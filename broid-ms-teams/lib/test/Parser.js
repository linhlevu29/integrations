"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@broid/utils");
const ava_1 = require("ava");
const Bluebird = require("bluebird");
const glob = require("glob");
const path = require("path");
const sinon = require("sinon");
const Parser_1 = require("../core/Parser");
const RESPONSE_FIXTURES = {};
glob.sync(path.join(__dirname, './fixtures/ms-teams/*.json')).forEach((file) => {
    RESPONSE_FIXTURES[path.basename(file).replace('.json', '')] = require(file);
});
const RESULT_FIXTURES = {};
glob.sync(path.join(__dirname, './fixtures/broid/*.json')).forEach((file) => {
    RESULT_FIXTURES[path.basename(file).replace('.json', '')] = require(file);
});
let parser;
ava_1.default.before(() => {
    parser = new Parser_1.Parser('ms-teams', 'test_service', 'info');
    sinon.stub(utils, 'fileInfo').callsFake((file) => {
        if (file.indexOf('JPG') > -1) {
            return Bluebird.resolve({ mimetype: 'image/jpeg' });
        }
        else if (file.indexOf('mp4') > -1) {
            return Bluebird.resolve({ mimetype: 'video/mp4' });
        }
        return Bluebird.resolve({ mimetype: '' });
    });
});
ava_1.default('Parse a simple message', (t) => __awaiter(this, void 0, void 0, function* () {
    const data = parser.parse(RESPONSE_FIXTURES.message);
    t.deepEqual(yield data, RESULT_FIXTURES.message);
}));
ava_1.default('Parse a message with media', (t) => __awaiter(this, void 0, void 0, function* () {
    const data = parser.parse(RESPONSE_FIXTURES.messageWithImage);
    t.deepEqual(yield data, RESULT_FIXTURES.messageWithImage);
}));
ava_1.default('Parse a message with video', (t) => __awaiter(this, void 0, void 0, function* () {
    const data = parser.parse(RESPONSE_FIXTURES.messageWithVideo);
    t.deepEqual(yield data, RESULT_FIXTURES.messageWithVideo);
}));
ava_1.default('Validate a simple message', (t) => __awaiter(this, void 0, void 0, function* () {
    const data = parser.validate(RESULT_FIXTURES.message);
    t.deepEqual(yield data, RESULT_FIXTURES.message);
}));
ava_1.default('Validate a message with image', (t) => __awaiter(this, void 0, void 0, function* () {
    const data = parser.validate(RESULT_FIXTURES.messageWithImage);
    t.deepEqual(yield data, RESULT_FIXTURES.messageWithImage);
}));
ava_1.default('Validate a message with video', (t) => __awaiter(this, void 0, void 0, function* () {
    const data = parser.validate(RESULT_FIXTURES.messageWithVideo);
    t.deepEqual(yield data, RESULT_FIXTURES.messageWithVideo);
}));
