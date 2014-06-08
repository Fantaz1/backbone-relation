var customMatchers = {
  toBeInstanceOf: function(util, customEqualityTesters){
    return {
      compare: function(actual, expected){
        return {
          pass: actual instanceof expected
        }
      }
    }
  }
}

beforeEach(function() {
  jasmine.addMatchers(customMatchers);
});