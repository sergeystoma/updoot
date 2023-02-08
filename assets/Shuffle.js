// Randomize array elements without mutating the original array using the 
// Durstenfeld shuffle algorithm.
export function shuffleArray(array) {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Randomize array elements without mutating the original array using a 
// modification of Mike Bostock's implementation of the Fisher-Yates algorithm.
export function shuffleArrayWithSeed(array, seed) {
    let shuffledArray = [...array];
    let toShuffleCount = shuffledArray.length;
  
    while (toShuffleCount) {
        let randIndex = Math.floor(random(seed) * toShuffleCount--);
  
        let swapTmp = shuffledArray[toShuffleCount];
        shuffledArray[toShuffleCount] = shuffledArray[randIndex];
        shuffledArray[randIndex] = swapTmp;

        ++seed;
    }
  
    return shuffledArray;
}

function random(seed) {
    let x = Math.sin(seed++) * 10000;
    let r = x - Math.floor(x);
    return r;
}
