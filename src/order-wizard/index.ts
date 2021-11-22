
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
import * as ts from 'typescript';


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
      const rootModulePath = `${project.root}/${project.sourceRoot}/${project.prefix}/${project.prefix}.module.ts`;
      const importContent = `import { ${exportModuleName}Module } from './${modulePath}/${moduleName}/${moduleName}.module';`

      const moduleFiles = getAsSourceFile(tree,rootModulePath)
      const lastImportEndPos  = findlastImportEndPos(moduleFiles)
      const importArrayEndPos = findImportArray(moduleFiles)

      const rec = tree.beginUpdate(rootModulePath)
      rec.insertLeft(lastImportEndPos + 1 ,importContent)
      rec.insertLeft(importArrayEndPos - 1 ,`, ${exportModuleName}Module`)
      tree.commitUpdate(rec)

      return tree
  }
}

function getAsSourceFile(tree: Tree,path: string): ts.SourceFile {
  const file = tree.read(path);
  if(!file){
    throw new SchematicsException(`${path} not found`)
  }

  return ts.createSourceFile(
    path,
    file.toString(),
    ts.ScriptTarget.Latest,
    true
  )
}

function findlastImportEndPos(file: ts.SourceFile): number {
  let pos: number = 0;
  file.forEachChild((child: ts.Node) => {
    if(child.kind === ts.SyntaxKind.ImportDeclaration){
        pos = child.end
    }
  })

  return pos;
}

function findImportArray(file: ts.SourceFile): number {
  let pos: number = 0;

  file.forEachChild((node: ts.Node) => {
    if(node.kind === ts.SyntaxKind.ClassDeclaration){
        node.forEachChild((classChild: ts.Node) => {
              if(classChild.kind === ts.SyntaxKind.Decorator){
                  classChild.forEachChild((moduleDeclaration: ts.Node) => {
                    moduleDeclaration.forEachChild((objectLitreal: ts.Node) => {
                          objectLitreal.forEachChild((property: ts.Node) => {
                            if(property.getFullText().includes('imports')){
                                pos = property.end
                            }
                          })
                    })
                  })
              }
        })
    }
  })

  return pos
}