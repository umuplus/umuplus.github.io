class Terrain {
    constructor(dim, ts) {
        this.dim = dim instanceof Array && dim.length === 2 ? dim : [ 24, 14 ];
        this.tileset = ts instanceof TileSet ? ts : new TileSet();
        this.width = (this.dim[0] * this.tileset.dim[0]) + (this.tileset.dim[0] / 2);
        this.height = (this.dim[1] * this.tileset.dim[1]) - ((this.dim[1] - 1) * 18);
        this.layers = [];
    }

    addLayer(tile, listeners) {
        if (!(tile instanceof jQuery)) {
            listeners = tile;
            tile = this.tileset.createGrass();
        }
        if (!listeners || typeof listeners !== 'object') listeners = {};
        let line = 0;
        const layer = [];
        for (let y = 0 ; y < this.dim[1] ; y++) {
            const row = [];
            for (let x = 0 ; x < this.dim[0] ; x++) {
                const el = tile.clone();
                const top = (y * this.tileset.dim[1]) - (y ? y * 18 : 0);
                const left = (x * this.tileset.dim[0]) + (y % 2 ? this.tileset.dim[0] / 2 : 0);
                const coord = [ line, y % 2 ? x * 2 + 1 : x * 2 ];
                const id = 'L' + this.layers.length + '_' + (Math.random() + x + y).toString().replace('.', '');
                el.attr('id', id)
                    .data('x', coord[1]).data('y', coord[0])
                    .css('top', top + 'px').css('left', left + 'px');
                for (let fn of Object.keys(listeners)) {
                    if (typeof listeners[fn] === 'function')
                        el[fn](function (e) {
                            listeners[fn].bind(this)(el, e);
                        });
                }
                row.push(el);
            }
            layer.push(row);
            if (y % 2) line++;
        }
        this.layers.push(layer);
    }
}
