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

        return (
            <path d={path} fill={this.props.color} onClick={() => this.props.onClick()} />
        );
    }
}

class Circle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sectors: Array(12).fill("#fff")
        };
    }

    handleClick(i) {
        const sectors = this.state.sectors.slice();
        const color = this.props.apply();
        console.log(color);
        sectors[i] = color;
        this.setState({ sectors: sectors });
    }

    renderSector(i) {
        return (
            <Sector x="0" y="0" d={this.props.diameter}
                a1={i * 30} a2={i * 30 + 30}
                color={this.state.sectors[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        return (
            <g transform={`translate(${this.props.centerX},${this.props.centerY})`} stroke="#000" strokeWidth="2">
                {this.renderSector(0)}
                {this.renderSector(1)}
                {this.renderSector(2)}
                {this.renderSector(3)}
                {this.renderSector(4)}
                {this.renderSector(5)}
                {this.renderSector(6)}
                {this.renderSector(7)}
                {this.renderSector(8)}
                {this.renderSector(9)}
                {this.renderSector(10)}
                {this.renderSector(11)}
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
        "#daa520", // gold
        "#ffff00", // yellow
        "#808000", // olive
        "#006400", // green
        "#00ced1", // turquise
        "#4169e1", // blue
        "#000080", // indigo blue
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
        return (
            <g stroke="#000" strokeWidth="2">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
                {this.renderSquare(9)}
                {this.renderSquare(10)}
                {this.renderSquare(11)}
                {this.renderSquare(12)}
                {this.renderSquare(13)}
                {this.renderSelection()}
            </g>
        );
    }
}

class CircleColoring extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedColor: "#fff"
        };
    }

    selectColor(color) {
        this.setState({ selectedColor: color });
    }

    getSelectedColor() {
        return this.state.selectedColor;
    }

    render() {
        const size = 600;

        return (
            <div>
                <h1>Chroma Therapy</h1>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <rect width={size} height={size} fill="none" stroke="#000" strokeWidth="1" />
                    <Circle centerX={size / 2} centerY={size / 2.5} diameter={size * 2 / 3} apply={() => this.getSelectedColor()} />
                    <ColorPicker width={size} y={size - 100} select={(color) => this.selectColor(color)} />
                </svg>
            </div>
        );
    }
}

export default CircleColoring;
