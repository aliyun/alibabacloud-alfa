
import objectAssign from 'object-assign';
import escapeStringRegexp from 'escape-string-regexp';
import postcss from 'postcss';

const CSS_ESCAPED_TAB = '\\9';

interface IOptions {
  // The number of times `:not(#\\9)` is appended in front of the selector
  repeat: number;
  // Whether to add !important to declarations in rules with id selectors
  overrideIds: boolean;
  // The thing we repeat over and over to make up the piece that increases specificity
  stackableRoot: string;
}

function increaseSpecifityOfRule(rule: postcss.Rule, opts: IOptions) {
  rule.selectors = rule.selectors.map(function(selector: string) {
    // Apply it to the selector itself if the selector is a `root` level component
    // `html:not(#\\9):not(#\\9):not(#\\9)`
    if(
      selector === 'html' ||
      selector === ':root' ||
      selector === ':host' ||
      selector === opts.stackableRoot
    ) {
      return selector + opts.stackableRoot.repeat(opts.repeat);
    }

    // Otherwise just make it a descendant (this is what will happen most of the time)
    // `:not(#\\9):not(#\\9):not(#\\9) .foo`
    return opts.stackableRoot.repeat(opts.repeat) + ' ' + selector;
  });

  if(opts.overrideIds) {
    if(
      // If an id is in there somewhere
      (new RegExp('#(?!' + escapeStringRegexp(CSS_ESCAPED_TAB) + ')')).test(rule.selector) ||
      // Or it is an attribute selector with an id
      (/\[id/).test(rule.selector)
    ) {
      rule.walkDecls(function(decl) {
        decl.important = true;
      });
    }
  }
}

const defaultOptions = {
  // The number of times `:not(#\\9)` is appended in front of the selector
  repeat: 3,
  // Whether to add !important to declarations in rules with id selectors
  overrideIds: true,
  // The thing we repeat over and over to make up the piece that increases specificity
  stackableRoot: ':not(#' + CSS_ESCAPED_TAB + ')'
};

// Plugin that adds `:not(#\\9)` selectors to the front of the rule thus increasing specificity
export const postcssWrap = postcss.plugin('postcss-css-wrapper', function(options: IOptions | undefined) {

  const opts = objectAssign({}, defaultOptions, options);

  return function(css: postcss.Root) {
    css.walkRules(function(rule: postcss.Rule) {
      // Avoid adding additional selectors (stackableRoot) to descendant rules of @keyframe {}
      // i.e. `from`, `to`, or `{number}%`
      var isInsideKeyframes = rule.parent.type === 'atrule' && rule.parent.name === 'keyframes';

      if(!isInsideKeyframes) {
        increaseSpecifityOfRule(rule, opts);
      }
    });
  };
});