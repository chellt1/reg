const fs = require('fs');

const searchTree = (node, searchValue, path = []) => {
  const regex = new RegExp(`^${formattedSearchValue.replace(/\*/g, '.*')}$`, 'i');

  if (node && node.Node && regex.test(node.Node.Label)) {
    const labelName = node.Node.Label.Name ? node.Node.Label.Name : node.Node.Label;
    results.push([...path, labelName]);
  }

  if (node && node.Children) {
    for (let i = 0; i < node.Children.length; i++) {
      searchTree(node.Children[i], [...path, node.Node.Label]);
    }
  }
};

const isValidValue = (node, searchValue) => {
  const regex = new RegExp(`^${searchValue.replace(/\*/g, '.*')}$`, 'i');

  if (node.Node && regex.test(node.Node.Label)) {
    return true;
  } else if (node.Children) {
    for (let i = 0; i < node.Children.length; i++) {
      if (isValidValue(node.Children[i], searchValue)) {
        return true;
      }
    }
  }
  
  for (const child of Object.values(node)) {
    if (typeof child === 'object') {
      if (isValidValue(child, searchValue)) {
        return true;
      }
    }
  }
  
  return false;
};


const filePath = './language-tree.json';
const fileContents = fs.readFileSync(filePath, 'utf-8');
const tree = JSON.parse(fileContents);

const searchValue = process.argv[2];

if (!searchValue) {
  console.log('Please enter a search value. Example: "node script.js Ukr*" or "node script.js Ukrainian"');
} else {
  const formattedSearchValue = searchValue.charAt(0).toUpperCase() + searchValue.slice(1).toLowerCase();

  if (!isValidValue(tree, formattedSearchValue)) {
    console.log(`${formattedSearchValue} is not a valid language name.`);
  } else {
    const rootNode = tree.Root;
    const results = [];

    const searchInNode = (node, path) => {
      const regex = new RegExp(`^${formattedSearchValue.replace(/\*/g, '.*')}$`, 'i');
    
      if (node && node.Node && regex.test(node.Node.Label)) {
        const labelName = node.Node.Language ? node.Node.Language.Name : node.Node.Label;
        results.push([...path, labelName]);
      }
    
      if (node && node.Children) {
        for (let i = 0; i < node.Children.length; i++) {
          searchInNode(node.Children[i], [...path, node.Node.Label]);
        }
      }
    };    

    searchInNode(rootNode, []);

    if (results.length === 0) {
      console.log(`${formattedSearchValue} was not found in the tree.`);
    } else {
      console.log('Results:');
      for (const result of results) {
        console.log(result.join(' -> '));
      }
    }
  }
}