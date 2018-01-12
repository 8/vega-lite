"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../src/log");
var channel_1 = require("../src/channel");
var mark_1 = require("../src/mark");
var scale_1 = require("../src/scale");
var spec_1 = require("../src/spec");
var stack_1 = require("../src/stack");
describe('stack', function () {
    var NON_STACKABLE_MARKS = [mark_1.RECT];
    it('should be disabled for non-stackable marks with at least of of the stack channel', function () {
        var _loop_1 = function (stacked) {
            NON_STACKABLE_MARKS.forEach(function (nonStackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": nonStackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_1(stacked);
        }
    });
    it('should be allowed for raw plot', function () {
        stack_1.STACKABLE_MARKS.forEach(function (mark) {
            var spec = {
                "data": { "url": "data/barley.json" },
                "mark": mark,
                "encoding": {
                    "x": { "field": "yield", "type": "quantitative", "stack": "zero" },
                    "y": { "field": "variety", "type": "nominal" },
                    "color": { "field": "site", "type": "nominal" }
                }
            };
            var stackProps = stack_1.stack(spec.mark, spec.encoding, undefined);
            chai_1.assert.equal(stackProps.fieldChannel, 'x');
            chai_1.assert.isTrue(spec_1.isStacked(spec));
        });
    });
    it('should prioritize axis with stack', function () {
        stack_1.STACKABLE_MARKS.forEach(function (mark) {
            var spec = {
                "data": { "url": "data/barley.json" },
                "mark": mark,
                "encoding": {
                    "x": { "field": "yield", "type": "quantitative", "stack": "zero" },
                    "y": { "field": "variety", "type": "quantitative" },
                    "color": { "field": "site", "type": "nominal" }
                }
            };
            var stackProps = stack_1.stack(spec.mark, spec.encoding, undefined);
            chai_1.assert.equal(stackProps.fieldChannel, 'x');
            chai_1.assert.isTrue(spec_1.isStacked(spec));
        });
    });
    it('should always be disabled if there is no stackby channel', function () {
        var _loop_2 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_2(stacked);
        }
    });
    it('should always be disabled if the stackby channel is aggregated', function () {
        var _loop_3 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "type": "quantitative" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_3(stacked);
        }
    });
    it('should always be disabled if the stackby channel is identical to y', function () {
        var _loop_4 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "variety", "type": "nominal" },
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_4(stacked);
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        var _loop_5 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "type": "quantitative" },
                        "detail": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, spec.config.stack);
                chai_1.assert.isOk(_stack);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
                chai_1.assert.equal(_stack.stackBy[0].channel, channel_1.DETAIL);
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_5(stacked);
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        var _loop_6 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative", "stack": stacked },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "type": "quantitative" },
                        "detail": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.isOk(_stack);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
                chai_1.assert.equal(_stack.stackBy[0].channel, channel_1.DETAIL);
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_6(stacked);
        }
    });
    it('should always be disabled if both x and y are aggregate', function () {
        var _loop_7 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "aggregate": "count", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_7(stacked);
        }
    });
    it('should always be disabled if neither x nor y is aggregate or stack', function () {
        var _loop_8 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "field": "variety", "type": "nominal" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_8(stacked);
        }
    });
    it('should always be disabled if there is both x and x2', log.wrap(function (localLogger) {
        var _loop_9 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "mark": mark,
                    "encoding": {
                        "x": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "x2": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
                var warns = localLogger.warns;
                chai_1.assert.equal(warns[warns.length - 1], log.message.cannotStackRangedMark(channel_1.X), JSON.stringify({ stacked: stacked, mark: mark }));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_9(stacked);
        }
    }));
    it('should always be disabled if there is both y and y2', log.wrap(function (localLogger) {
        var _loop_10 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "mark": mark,
                    "encoding": {
                        "y": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "y2": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "x": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
                var warns = localLogger.warns;
                chai_1.assert.equal(warns[warns.length - 1], log.message.cannotStackRangedMark(channel_1.Y), JSON.stringify({ stacked: stacked, mark: mark }));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_10(stacked);
        }
    }));
    it('should always be disabled if the aggregated axis has non-linear scale', log.wrap(function (localLogger) {
        var _loop_11 = function (stacked) {
            [scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT].forEach(function (scaleType) {
                var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
                marks.forEach(function (mark) {
                    var spec = {
                        "data": { "url": "data/barley.json" },
                        "mark": mark,
                        "encoding": {
                            "x": { "field": "a", "type": "quantitative", "aggregate": "sum", "scale": { "type": scaleType } },
                            "y": { "field": "variety", "type": "nominal" },
                            "color": { "field": "site", "type": "nominal" }
                        },
                        "config": {
                            "stack": stacked
                        }
                    };
                    chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                    chai_1.assert.isFalse(spec_1.isStacked(spec));
                    var warns = localLogger.warns;
                    chai_1.assert.equal(warns[warns.length - 1], log.message.cannotStackNonLinearScale(scaleType));
                });
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_11(stacked);
        }
    }));
    it('should throws warning if the aggregated axis has a non-summative aggregate', log.wrap(function (localLogger) {
        var _loop_12 = function (stack_2) {
            var _loop_13 = function (aggregate) {
                var marks = stack_2 === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
                marks.forEach(function (mark) {
                    var spec = {
                        "data": { "url": "data/barley.json" },
                        "mark": mark,
                        "encoding": {
                            "x": {
                                aggregate: aggregate, stack: stack_2,
                                "field": "a", "type": "quantitative"
                            },
                            "y": { "field": "variety", "type": "nominal" },
                            "color": { "field": "site", "type": "nominal" }
                        }
                    };
                    chai_1.assert.isTrue(spec_1.isStacked(spec));
                    var warns = localLogger.warns;
                    chai_1.assert.equal(warns[warns.length - 1], log.message.stackNonSummativeAggregate(aggregate));
                });
            };
            for (var _i = 0, _a = ['average', 'variance', 'q3']; _i < _a.length; _i++) {
                var aggregate = _a[_i];
                _loop_13(aggregate);
            }
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stack_2 = _a[_i];
            _loop_12(stack_2);
        }
    }));
    describe('stack().groupbyChannel, .fieldChannel', function () {
        it('should be correct for horizontal', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.X);
                chai_1.assert.equal(_stack.groupbyChannel, channel_1.Y);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be correct for horizontal (single)', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.X);
                chai_1.assert.equal(_stack.groupbyChannel, null);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be correct for vertical', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "y": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "x": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.Y);
                chai_1.assert.equal(_stack.groupbyChannel, channel_1.X);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be correct for vertical (single)', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "y": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.Y);
                chai_1.assert.equal(_stack.groupbyChannel, null);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
    });
    describe('stack().offset', function () {
        it('should be zero for stackable marks with at least of of the stack channel if stacked is unspecified', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                chai_1.assert.equal(stack_1.stack(spec.mark, spec.encoding, undefined).offset, 'zero');
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be the specified stacked for stackable marks with at least one of the stack channel', function () {
            var _loop_14 = function (stacked) {
                [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                    var spec = {
                        "data": { "url": "data/barley.json" },
                        "mark": stackableMark,
                        "encoding": {
                            "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                            "y": { "field": "variety", "type": "nominal" },
                            "color": { "field": "site", "type": "nominal" }
                        },
                        "config": {
                            "stack": stacked
                        }
                    };
                    chai_1.assert.equal(stack_1.stack(spec.mark, spec.encoding, spec.config.stack).offset, stacked);
                    chai_1.assert.equal(spec_1.isStacked(spec), true);
                });
            };
            for (var _i = 0, _a = ['center', 'zero', 'normalize']; _i < _a.length; _i++) {
                var stacked = _a[_i];
                _loop_14(stacked);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsZ0NBQWtDO0FBR2xDLDBDQUE0QztBQUM1QyxvQ0FBNkQ7QUFDN0Qsc0NBQXVDO0FBQ3ZDLG9DQUEwRDtBQUMxRCxzQ0FBeUY7QUFFekYsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixJQUFNLG1CQUFtQixHQUFHLENBQUMsV0FBSSxDQUFDLENBQUM7SUFFbkMsRUFBRSxDQUFDLGtGQUFrRixFQUFFO2dDQUMxRSxPQUFPO1lBQ2hCLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFDLGdCQUFnQjtnQkFDM0MsSUFBTSxJQUFJLEdBQXVCO29CQUMvQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7b0JBQ25DLE1BQU0sRUFBRSxnQkFBZ0I7b0JBQ3hCLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQzt3QkFDbkUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3dCQUM1QyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7cUJBQzlDO29CQUNELFFBQVEsRUFBRTt3QkFDUixPQUFPLEVBQUUsT0FBTztxQkFDakI7aUJBQ0YsQ0FBQztnQkFDRixhQUFNLENBQUMsTUFBTSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxhQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFTLENBQUMsSUFB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LEVBQUM7d0JBQ25DLE1BQU0sRUFBRSxhQUFhO3dCQUNyQixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7NEJBQ25FLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzs0QkFDNUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3lCQUM5Qzt3QkFDRCxRQUFRLEVBQUU7NEJBQ1IsT0FBTyxFQUFFLE9BQU87eUJBQ2pCO3FCQUNGLENBQUM7b0JBQ0YsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNqRixhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQWpCRCxHQUFHLENBQUMsQ0FBa0IsVUFBZ0QsRUFBaEQsS0FBQSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFrQixFQUFoRCxjQUFnRCxFQUFoRCxJQUFnRDtnQkFBakUsSUFBTSxPQUFPLFNBQUE7eUJBQVAsT0FBTzthQWlCakI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vc3JjL2xvZyc7XG5cbmltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJy4uL3NyYy9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtERVRBSUwsIFgsIFl9IGZyb20gJy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7QVJFQSwgQkFSLCBQUklNSVRJVkVfTUFSS1MsIFJFQ1R9IGZyb20gJy4uL3NyYy9tYXJrJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtpc1N0YWNrZWQsIFRvcExldmVsLCBVbml0U3BlY30gZnJvbSAnLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtzdGFjaywgU1RBQ0tfQllfREVGQVVMVF9NQVJLUywgU1RBQ0tBQkxFX01BUktTLCBTdGFja09mZnNldH0gZnJvbSAnLi4vc3JjL3N0YWNrJztcblxuZGVzY3JpYmUoJ3N0YWNrJywgKCkgPT4ge1xuICBjb25zdCBOT05fU1RBQ0tBQkxFX01BUktTID0gW1JFQ1RdO1xuXG4gIGl0KCdzaG91bGQgYmUgZGlzYWJsZWQgZm9yIG5vbi1zdGFja2FibGUgbWFya3Mgd2l0aCBhdCBsZWFzdCBvZiBvZiB0aGUgc3RhY2sgY2hhbm5lbCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgTk9OX1NUQUNLQUJMRV9NQVJLUy5mb3JFYWNoKChub25TdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbm9uU3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYmUgYWxsb3dlZCBmb3IgcmF3IHBsb3QnLCAoKSA9PiB7XG4gICAgU1RBQ0tBQkxFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzdGFja1wiOiBcInplcm9cIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YWNrUHJvcHMgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RhY2tQcm9wcy5maWVsZENoYW5uZWwsICd4Jyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgaXQoJ3Nob3VsZCBwcmlvcml0aXplIGF4aXMgd2l0aCBzdGFjaycsICgpID0+IHtcbiAgICBTVEFDS0FCTEVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8VW5pdFNwZWM+ID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiemVyb1wifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFja1Byb3BzID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0YWNrUHJvcHMuZmllbGRDaGFubmVsLCAneCcpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiB0aGVyZSBpcyBubyBzdGFja2J5IGNoYW5uZWwnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnLCBudWxsLCAnbm9uZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIFBSSU1JVElWRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlIHN0YWNrYnkgY2hhbm5lbCBpcyBhZ2dyZWdhdGVkJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBQUklNSVRJVkVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcImNvdW50XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlIHN0YWNrYnkgY2hhbm5lbCBpcyBpZGVudGljYWwgdG8geScsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgUFJJTUlUSVZFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8VW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdjYW4gZW5hYmxlZCBpZiBvbmUgb2YgdGhlIHN0YWNrYnkgY2hhbm5lbHMgaXMgbm90IGFnZ3JlZ2F0ZWQnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJkZXRhaWxcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjayk7XG4gICAgICAgIGFzc2VydC5pc09rKF9zdGFjayk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5zdGFja0J5WzBdLmNoYW5uZWwsIERFVEFJTCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdjYW4gZW5hYmxlZCBpZiBvbmUgb2YgdGhlIHN0YWNrYnkgY2hhbm5lbHMgaXMgbm90IGFnZ3JlZ2F0ZWQnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IHN0YWNrZWR9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImRldGFpbFwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5pc09rKF9zdGFjayk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5zdGFja0J5WzBdLmNoYW5uZWwsIERFVEFJTCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIGJvdGggeCBhbmQgeSBhcmUgYWdncmVnYXRlJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBQUklNSVRJVkVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgbmVpdGhlciB4IG5vciB5IGlzIGFnZ3JlZ2F0ZSBvciBzdGFjaycsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgUFJJTUlUSVZFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8VW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlcmUgaXMgYm90aCB4IGFuZCB4MicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgY29uc3QgbWFya3MgPSBzdGFja2VkID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgbWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieDJcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgIGNvbnN0IHdhcm5zID0gbG9jYWxMb2dnZXIud2FybnM7XG4gICAgICAgIGFzc2VydC5lcXVhbCh3YXJuc1t3YXJucy5sZW5ndGgtMV0sIGxvZy5tZXNzYWdlLmNhbm5vdFN0YWNrUmFuZ2VkTWFyayhYKSxcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7c3RhY2tlZDogc3RhY2tlZCwgbWFyazogbWFya30pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiB0aGVyZSBpcyBib3RoIHkgYW5kIHkyJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ5MlwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgY29uc3Qgd2FybnMgPSBsb2NhbExvZ2dlci53YXJucztcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHdhcm5zW3dhcm5zLmxlbmd0aC0xXSwgbG9nLm1lc3NhZ2UuY2Fubm90U3RhY2tSYW5nZWRNYXJrKFkpLFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtzdGFja2VkOiBzdGFja2VkLCBtYXJrOiBtYXJrfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIHRoZSBhZ2dyZWdhdGVkIGF4aXMgaGFzIG5vbi1saW5lYXIgc2NhbGUnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIFtTY2FsZVR5cGUuTE9HLCBTY2FsZVR5cGUuUE9XLCBTY2FsZVR5cGUuU1FSVF0uZm9yRWFjaCgoc2NhbGVUeXBlKSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcmtzID0gc3RhY2tlZCA9PT0gdW5kZWZpbmVkID8gU1RBQ0tfQllfREVGQVVMVF9NQVJLUyA6IFNUQUNLQUJMRV9NQVJLUztcbiAgICAgICAgbWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IHNjYWxlVHlwZX19LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgICBjb25zdCB3YXJucyA9IGxvY2FsTG9nZ2VyLndhcm5zO1xuICAgICAgICAgIGFzc2VydC5lcXVhbCh3YXJuc1t3YXJucy5sZW5ndGgtMV0sIGxvZy5tZXNzYWdlLmNhbm5vdFN0YWNrTm9uTGluZWFyU2NhbGUoc2NhbGVUeXBlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCB0aHJvd3Mgd2FybmluZyBpZiB0aGUgYWdncmVnYXRlZCBheGlzIGhhcyBhIG5vbi1zdW1tYXRpdmUgYWdncmVnYXRlJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFjayBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgZm9yIChjb25zdCBhZ2dyZWdhdGUgb2YgWydhdmVyYWdlJywgJ3ZhcmlhbmNlJywgJ3EzJ10gYXMgQWdncmVnYXRlT3BbXSkge1xuICAgICAgICBjb25zdCBtYXJrcyA9IHN0YWNrID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8VW5pdFNwZWM+ID0ge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZSwgc3RhY2ssXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgICAgY29uc3Qgd2FybnMgPSBsb2NhbExvZ2dlci53YXJucztcbiAgICAgICAgICBhc3NlcnQuZXF1YWwod2FybnNbd2FybnMubGVuZ3RoLTFdLCBsb2cubWVzc2FnZS5zdGFja05vblN1bW1hdGl2ZUFnZ3JlZ2F0ZShhZ2dyZWdhdGUpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KSk7XG5cbiAgZGVzY3JpYmUoJ3N0YWNrKCkuZ3JvdXBieUNoYW5uZWwsIC5maWVsZENoYW5uZWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBjb3JyZWN0IGZvciBob3Jpem9udGFsJywgKCkgPT4ge1xuICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZmllbGRDaGFubmVsLCBYKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5ncm91cGJ5Q2hhbm5lbCwgWSk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb3JyZWN0IGZvciBob3Jpem9udGFsIChzaW5nbGUpJywgKCkgPT4ge1xuICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZmllbGRDaGFubmVsLCBYKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5ncm91cGJ5Q2hhbm5lbCwgbnVsbCk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb3JyZWN0IGZvciB2ZXJ0aWNhbCcsICgpID0+IHtcbiAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8VW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmZpZWxkQ2hhbm5lbCwgWSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZ3JvdXBieUNoYW5uZWwsIFgpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY29ycmVjdCBmb3IgdmVydGljYWwgKHNpbmdsZSknLCAoKSA9PiB7XG4gICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IF9zdGFjayA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5maWVsZENoYW5uZWwsIFkpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmdyb3VwYnlDaGFubmVsLCBudWxsKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzdGFjaygpLm9mZnNldCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHplcm8gZm9yIHN0YWNrYWJsZSBtYXJrcyB3aXRoIGF0IGxlYXN0IG9mIG9mIHRoZSBzdGFjayBjaGFubmVsIGlmIHN0YWNrZWQgaXMgdW5zcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5lcXVhbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCkub2Zmc2V0LCAnemVybycpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgdGhlIHNwZWNpZmllZCBzdGFja2VkIGZvciBzdGFja2FibGUgbWFya3Mgd2l0aCBhdCBsZWFzdCBvbmUgb2YgdGhlIHN0YWNrIGNoYW5uZWwnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgWydjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxVbml0U3BlYz4gPSB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGFzc2VydC5lcXVhbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKS5vZmZzZXQsIHN0YWNrZWQpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChpc1N0YWNrZWQoc3BlYyksIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==