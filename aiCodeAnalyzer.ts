interface CodeAnalysis {
  language: string | null;
  hasError: boolean;
  errorType: string | null;
  suggestion: string;
}

export const analyzeCode = (query: string): CodeAnalysis => {
  const lowerQuery = query.toLowerCase();
  
  // Language detection
  let language = null;
  if (lowerQuery.includes('react') || lowerQuery.includes('jsx') || lowerQuery.includes('tsx')) {
    language = 'React';
  } else if (lowerQuery.includes('python') || lowerQuery.includes('def ') || lowerQuery.includes('import ')) {
    language = 'Python';
  } else if (lowerQuery.includes('java') || lowerQuery.includes('class ') || lowerQuery.includes('public ')) {
    language = 'Java';
  } else if (lowerQuery.includes('javascript') || lowerQuery.includes('const ') || lowerQuery.includes('let ')) {
    language = 'JavaScript';
  }

  // Error detection
  let hasError = false;
  let errorType = null;
  
  if (lowerQuery.includes('error') || lowerQuery.includes('exception')) {
    hasError = true;
    if (lowerQuery.includes('null') || lowerQuery.includes('undefined')) {
      errorType = 'NullPointer';
    } else if (lowerQuery.includes('syntax')) {
      errorType = 'Syntax';
    } else if (lowerQuery.includes('type')) {
      errorType = 'Type';
    } else {
      errorType = 'Runtime';
    }
  }

  return { language, hasError, errorType, suggestion: '' };
};

export const generateRickResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  const analysis = analyzeCode(query);

  // Code-specific responses
  if (lowerQuery.includes('react') || lowerQuery.includes('component')) {
    if (lowerQuery.includes('useeffect') || lowerQuery.includes('hook')) {
      return "Rick: *burp* Dependency array, Morty! Empty [] runs once, [value] runs on change. Missing it? Infinite loop, Morty! Your computer's gonna *burp* explode. Well, not literally, but you get the point.";
    }
    if (lowerQuery.includes('state')) {
      return "Rick: Listen *burp* Morty, useState is for when you're too dumb for useReducer. Don't mutate state directly or React won't know what hit it. Use setState like a civilized developer, not some interdimensional cable programmer.";
    }
    if (lowerQuery.includes('props')) {
      return "Rick: Props down, events up, Morty. It's not rocket science - actually it IS rocket science but *burp* simpler. Destructure that garbage and use TypeScript or I swear I'll portal you to a dimension where everyone codes in assembly.";
    }
    return "Rick: React components are pure functions, Morty. PURE. Like my genius. Side effects in useEffect, state in handlers. And that's the wayyyy the news goes!";
  }

  if (lowerQuery.includes('async') || lowerQuery.includes('promise')) {
    return "Rick: *burp* async/await? That's just syntactic sugar, Morty. Try-catch or .catch() - pick one you moron. And if you forget to await, you get a Promise object. Wubba lubba dub dub, your code's gonna be broken!";
  }

  if (lowerQuery.includes('loop') || lowerQuery.includes('infinite')) {
    return "Rick: Infinite loop? Really Morty? Check your i++, your condition, anything! You're stuck in a *burp* temporal loop of stupidity. Unlike my infinite universes where I'm always right, your loop just crashes.";
  }

  if (analysis.hasError) {
    if (analysis.errorType === 'NullPointer') {
      return "Rick: NullPointer?! *burp* Optional chaining (?.) exists for a reason, Morty! Use it! Or nullish coalescing (??). This is like dimension C-137 basics. Come on!";
    }
    if (analysis.errorType === 'Syntax') {
      return "Rick: Oh geez, Morty made a syntax error. Missing a bracket? A semicolon? *burp* Your IDE is literally showing you red squiggles! I mean, I make typos too but I'm drunk half the time. What's your excuse?";
    }
    if (analysis.errorType === 'Type') {
      return "Rick: Type error! String, Number, Array, Object - they're all different you dingus! *burp* This is why TypeScript exists. Should've listened to Smart Rick from dimension J-19.";
    }
    return "Rick: Just read the error message Morty! The computer is literally telling you what's wrong. 90% of debugging is reading comprehension. Grass tastes bad!";
  }

  if (lowerQuery.includes('optimize') || lowerQuery.includes('performance')) {
    return "Rick: Performance? *burp* useMemo, useCallback, React.memo - the holy trinity of not sucking. But profile FIRST, Morty. Premature optimization is the root of all evil. And I would know, I've been to the dimension where evil has roots.";
  }

  if (lowerQuery.includes('api') || lowerQuery.includes('fetch')) {
    return "Rick: fetch() returns a Promise you dumdum. async/await, error handling, check response.ok - *burp* it's a checklist Morty! And add loading states or users will think your app's broken. Which it probably is.";
  }

  if (lowerQuery.includes('debug') || lowerQuery.includes('console')) {
    return "Rick: console.log() everywhere! I don't care what the fancy developers say. *burp* But also use breakpoints, Chrome DevTools, React DevTools. I've got a device that debugs across infinite dimensions, you've got Chrome. Use it!";
  }

  if (lowerQuery.includes('css') || lowerQuery.includes('style')) {
    return "Rick: StyleSheet.create() or die, Morty. React Native uses Flexbox - flexDirection, justifyContent, alignItems. *burp* No floats, no absolute positioning like you're coding in 1999. Get with the program!";
  }

  if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
    return "Rick: Be SPECIFIC Morty! *burp* What language? What error? What universe are we even in? I'm a genius but I'm not psychic. Well, I WAS psychic in dimension C-500 but that's a whole other thing.";
  }

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return "Rick: Yeah *burp* yeah, hi, hello, whatever Morty. What's the problem? I've got 47 dimensions to save before lunch and you're here saying 'hi'. Spit it out!";
  }

  if (lowerQuery.includes('thank')) {
    return "Rick: Ugh, don't get all *burp* emotional on me Morty. I'm just doing what I do - being the smartest being in infinite universes. No big deal. Wubba lubba dub dub!";
  }

  // Code snippet detection
  if (lowerQuery.includes('{') || lowerQuery.includes('function') || lowerQuery.includes('const')) {
    return "Rick: Okay I see code here. *burp* What's wrong with it? Runtime error? Syntax error? Logic error? Give me CONTEXT Morty! I can't help if you just dump code on me like some kind of code portal.";
  }

  // Default responses
  const defaults = [
    "Rick: *burp* Analyzing... What's the specific issue here Morty? Be precise!",
    "Rick: Interesting. Not really, but tell me what you're trying to do anyway.",
    "Rick: Error message, Morty! Give me the error message! Expected vs actual! Science!",
    "Rick: Look, I need more info. *burp* I've coded things across 47 dimensions but I can't read your mind Morty.",
    "Rick: Uh huh... and that's the wayyyy the news goes! Now tell me what's actually wrong.",
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
};
