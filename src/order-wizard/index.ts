
import {
  apply,
  chain,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import {  normalize, strings } from '@angular-devkit/core';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function orderWizard(_options: any): Rule {
  console.log(_options); 
  return (tree: Tree, _context: SchematicContext) => {
    const folderPath = normalize(strings.dasherize(`${_options.path}/${_options.name}`))
    let files = url('./files') 
    const workspace = getWorkSpace(_options, tree)
    console.log(workspace)
    const newTree = apply(files,[
      move(folderPath),
      template({
          ...strings,
          ..._options
        }),
        specFilter(_options)
    ])
  
    const templateRule = mergeWith(newTree,MergeStrategy.Default)
    const updateModuleRule = updateRootModule(_options, workspace)
    const chainedRule = chain([templateRule,updateModuleRule])
    return chainedRule(tree, _context);
  };
}

function specFilter(_options: any): Rule {
  if(_options.spec == 'false'){
    return filter(path => {
      return !path.match(/\.spec\.ts$/) && !path.match(/test\.ts$/)
    })
  } 

  return filter(path => !path.match(/test\.ts$/))
}

function getWorkSpace(_option: any, tree: Tree) {
  const workspec = tree.read('/angular.json');

  if(!workspec){
    throw new SchematicsException('angular.json file not found');
  }

  return JSON.parse(workspec.toString())
}



function updateRootModule(_option: any,workspace: any) {

  return (tree: Tree,_context: SchematicContext): Tree => {
      _option.project = (_option.project === 'defaultProject') ? workspace.defaultProject : _option.project
      const project = workspace.project[_option.project]
      const moduleName = strings.dasherize(_option.name)
      const exportModuleName = strings.classify(_option.name)
      const modulePath = strings.dasherize(_option.path)
      const rootModule = `${project.root}/${project.sourceRoot}/${project.prefix}/${project.prefix}.module.ts`;
      const importContent = `import { ${exportModuleName}Module } from './${modulePath}/${moduleName}/${moduleName}.module';`

      const rec = tree.beginUpdate(rootModule)
      rec.insertLeft(0 ,importContent)
      tree.commitUpdate(rec)

      return tree
  }
}