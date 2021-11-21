
import {
  apply,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function orderWizard(_options: any): Rule {
  console.log(_options); 
  return (tree: Tree, _context: SchematicContext) => {
    const folderPath = normalize(strings.dasherize(`${_options.path}/${_options.name}`))
    let files = url('./files') 
    const newTree = apply(files,[
      move(folderPath),
      template({
          ...strings,
          ..._options
        })
    ])
  
    const templateRule = mergeWith(newTree,MergeStrategy.Default)
    return templateRule(tree, _context);
  };
}
