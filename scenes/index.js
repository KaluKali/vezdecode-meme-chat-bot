function scenes(reverse_markup, table_style={ align: ['l', 'l', 'l' ], hsep: '  ' }, resources) {

    let args = Object.keys(scenes.arguments).map(key=>(scenes.arguments[key]));
    return [
        require('./unknown_command')(...args),
        require('./blitz')(...args),
        require('./meme')(...args),
    ];
}

module.exports = scenes;
