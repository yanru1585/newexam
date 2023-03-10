let transformRemoveConsolePlugin:any = [];
 
if (process.env.NODE_ENV === 'production') {
 
  transformRemoveConsolePlugin = ['transform-remove-console']
 
};

