// pyret-prism.js
//
// Custom Prism.js grammar for Pyret (https://www.pyret.org/). Prism has no
// built-in Pyret component, so this registers one by hand, following the
// same pattern as gdscript-prism.js: define the grammar, hook into Prism's
// tokenizer so the autoloader plugin does not try (and fail) to fetch a
// "prism-pyret" component from the CDN, and pre-register it immediately.
//
// Token rules are translated from the DCIC textbook's own CodeMirror mode
// (pyret-hilite/pyret.js in the dcic-source repo), which is what governs
// how Pyret code looks in the original Scribble-built HTML. A few
// simplifications were made translating a stateful editor mode into a
// stateless static-highlighter grammar:
//   - Block comments (#| ... |#) are matched non-greedily and do not track
//     true nesting depth the way the CodeMirror mode does.
//   - Type/constructor names are colored using a "starts with a capital
//     letter" heuristic (the Pyret naming convention), rather than the
//     CodeMirror mode's context-sensitive tracking of what follows
//     "data"/"::"/"|". Confirmed with David 2026-06-17.
//   - Per David's request, operators (<, ==, +, -, etc.) and structural
//     punctuation (parens, commas, colons, etc.) are split into Prism's
//     usual separate "operator" and "punctuation" tokens, rather than
//     DCIC's original CodeMirror theme, which colors both identically.
//   - Identifiers may contain hyphens (Pyret's own lexical rule, e.g.
//     "num-sqr", "is-roughly"), so every keyword/identifier pattern ends
//     in a negative lookahead excluding hyphens as a continuation
//     character, not just letters/digits/underscore/dollar-sign.
(function() {
    if (!window.Prism) return;

    var pyretGrammar = {
        'comment': [
            /#\|[\s\S]*?\|#/,
            /#.*/
        ],
        'string': [
            {pattern: /```[\s\S]*?```/, greedy: true},
            {pattern: /"(?:\\.|[^"\\\r\n])*"/, greedy: true},
            {pattern: /'(?:\\.|[^'\\\r\n])*'/, greedy: true}
        ],
        'keyword': /\b(?:fun|when|for|if|let|ask|cases|data|shared|check|except|letrec|lam|method|examples|do|select|extend|transform|extract|sieve|order|reactor|try|ref-graph|block|table|load-table|end|var|rec|import|include|provide|provide-types|type|type-let|newtype|from|lazy|shadow|ref|of|and|or|as|else|is-not==|is-not=~|is-not<=>|is-not|is-roughly|is==|is=~|is<=>|is|satisfies|raises-other-than|raises-satisfies|raises-violates|raises|does-not-raise|violates|by|ascending|descending|sanitize|using|doc|otherwise|then|with|sharing|where|row|source)(?![a-zA-Z0-9_$-])/,
        'boolean': /\b(?:true|false)(?![a-zA-Z0-9_$-])/,
        'class-name': /\b[A-Z][a-zA-Z0-9_$-]*(?![a-zA-Z0-9_$-])/,
        'function': /\b[a-z_][a-zA-Z0-9_$-]*(?=\s*\()/,
        // Catch-all for any remaining identifier (not a keyword/boolean,
        // not capitalized, not call syntax). This MUST come before
        // "operator" below: Pyret identifiers are commonly kebab-case
        // (order-amt, nl-empty, is-roughly), and without claiming the
        // whole identifier here first, the operator pattern would grab
        // just the embedded hyphen and visibly split the name in two.
        'variable': /\b[a-z_][a-zA-Z0-9_$-]*(?![a-zA-Z0-9_$-])/,
        'number': [
            /~[-+]?(?:[0-9]+\/[0-9]+|[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?)/,
            /[-+]?[0-9]+\/[0-9]+/,
            /[-+]?[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?/
        ],
        'operator': /<=>|<=|<>|<|>=|>|==|=>|=|->|-|:=|\^|!|\+|\*|\/|\\/,
        'punctuation': /::|\.\.\.|:|\.|,|;|\||\(|\)|\{|\}|\[|\]/
    };

    // Hook into Prism's token initialization pipeline (same as gdscript-prism.js)
    Prism.hooks.add('before-tokenize', function(env) {
        if (env.language === 'pyret') {
            Prism.languages.pyret = pyretGrammar;
        }
    });

    // Pre-register it globally
    Prism.languages.pyret = pyretGrammar;
})();
