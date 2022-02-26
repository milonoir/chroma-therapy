import React from 'react';


class Sector extends React.Component {
    getSectorPath(x, y, outerDiameter, a1, a2) {
        const degtorad = Math.PI / 180;
        const halfOuterDiameter = outerDiameter / 2;
        const cr = halfOuterDiameter - 5;
        const cx1 = (Math.cos(degtorad * a2) * cr) + Number(x);
        const cy1 = (-Math.sin(degtorad * a2) * cr) + Number(y);
        const cx2 = (Math.cos(degtorad * a1) * cr) + Number(x);
        const cy2 = (-Math.sin(degtorad * a1) * cr) + Number(y);

        return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`;
    }

    render() {
        const path = this.getSectorPath(this.props.x, this.props.y, this.props.d, this.props.a1, this.props.a2);
        const id = `sector-${this.props.ident}`;

        return (
            <path id={id} d={path} fill={this.props.color} onClick={() => this.props.onClick()} />
        );
    }
}

class Circle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sectors: Array(12).fill("#ffffff")
        };
    }

    handleClick(i) {
        const sectors = this.state.sectors.slice();
        sectors[i] = this.props.apply(i);
        this.setState({ sectors: sectors });
    }

    renderSector(i) {
        return (
            <Sector
                key={i.toString()}
                ident={i}
                x="0"
                y="0"
                d={this.props.diameter}
                a1={i * 30}
                a2={i * 30 + 30}
                color={this.state.sectors[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        var sectors = [];
        for (var i = 0; i < 12; i++) {
            sectors.push(this.renderSector(i));
        }

        return (
            <g id="circle" transform={`translate(${this.props.centerX},${this.props.centerY})`} stroke="#000" strokeWidth="2">
                {sectors}
            </g>
        );
    }
}

class ColorPicker extends React.Component {
    margin = 10;
    colors = [
        "#ffffff", // white
        "#ffc0cb", // pink
        "#ff0000", // red
        "#ff7f50", // coral
        "#ffa500", // orange
        "#fdd017", // gold
        "#ffff00", // yellow
        "#98bf64", // olive
        "#028a0f", // green
        "#00ced1", // turquise
        "#1f45fc", // blue
        "#0a1172", // indigo blue
        "#9400d3", // purple
        "#ff00ff", // magenta
    ];

    constructor(props) {
        super(props);

        this.state = {
            selected: 0
        };
    }

    handleClick(i) {
        this.setState({ selected: i });
        this.props.select(this.colors[i]);
    }

    renderSquare(i) {
        const size = (this.props.width - 2 * this.margin) / this.colors.length;

        return (
            <rect
                key={i.toString()}
                x={this.margin + i * size}
                y={this.props.y}
                width={size}
                height={size}
                fill={this.colors[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    renderSelection() {
        const size = (this.props.width - 2 * this.margin) / this.colors.length;
        const path = `M${this.margin + this.state.selected * size} ${this.props.y - this.margin} l${size / 2} ${this.margin} l${size / 2} ${-this.margin} Z`

        return (
            <path d={path} fill="#777" />
        );
    }

    render() {
        var squares = [];
        for (var i = 0; i < this.colors.length; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <g stroke="#000" strokeWidth="2">
                {squares}
                {this.renderSelection()}
            </g>
        );
    }
}

class CircleColoring extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedColor: "#ffffff",
            firstSector: undefined,
        };
    }

    selectColor(color) {
        this.setState({ selectedColor: color });
    }

    getSelectedColor(i) {
        if (typeof this.state.firstSector === 'undefined') {
            var state = Object.assign({}, this.state);
            state.firstSector = i;
            this.setState(state);
        }

        return this.state.selectedColor;
    }

    export() {
        var order = [];
        for (var i = 0; i < 12; i++) {
            const id = ((this.state.firstSector || 0) - i + 12) % 12;
            order.push(document.getElementById("sector-" + id.toString()).getAttribute("fill"));
        }
        const result = btoa(order.join(","));
        document.getElementById("result").innerHTML = result;
    }

    copy() {
        var result = document.getElementById("result");
        result.select();
        result.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Result copied to clipboard");
    }

    render() {
        const size = 500;

        return (
            <div>
                <h1>Chroma Therapy</h1>
                <svg width="100%" height={size} viewBox={`0 0 ${size} ${size}`}>
                    <rect width={size} height={size} fill="none" stroke="#000" strokeWidth="1" />
                    <Circle centerX={size / 2} centerY={size / 2.5} diameter={size * 2 / 3} apply={(i) => this.getSelectedColor(i)} />
                    <ColorPicker width={size} y={size - 100} select={(color) => this.selectColor(color)} />
                </svg>
                <div className="row">
                    <button onClick={() => this.export()}>Generate code</button>
                </div>
                <div className="row">
                    <textarea id="result" rows="3" cols="50" readOnly />
                </div>
                <div className="row">
                    <button onClick={() => this.copy()}>Copy to clipboard</button>
                </div>
            </div>
        );
    }
}

export default CircleColoring;
