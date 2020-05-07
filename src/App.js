import React from 'react';
import './App.css';


const range = [[0, 2], [3, 5], [6, 8]];

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        const {matrix, originalMatrix} = this.generateMap();
        console.log(matrix, originalMatrix);
        this.state = {
            matrix,
            originalMatrix,
            time: 0,
            life: 3,
            complete: false
        };

        this.tryTime = 0;
    }

    componentDidMount() {
        document.onkeypress = ev => {
            const {matrix, originalMatrix, selection} = this.state;
            if (selection) {
                if (originalMatrix[selection[0]][selection[1]] == ev.key) {
                    matrix[selection[0]][selection[1]] = ev.key;
                    let complete = true;
                    matrix.forEach(i => i.forEach(i => {
                            if (i == "-") {
                                complete = false
                            }
                        })
                    );
                    if (complete)
                        this.completeGame()
                    this.setState({matrix, selection: undefined, complete})
                } else {
                    this.setState({life: this.state.life - 1})
                }

            }
        };

        setInterval(() => {
            if (!this.state.complete)
                this.setState({time: this.state.time + 1});
        }, 1000)
    }

    completeGame = () => {
        this.setState({complete: true})
    };


    generateMap = () => {
        const matrix = [];
        for (let i = 0; i < 9; i++) {
            matrix[i] = [];
            for (let j = 0; j < 9; j++) {
                const value = this.generateValue(matrix, i, j);
                if (value === -1) {
                    return this.generateMap();
                }
                matrix[i][j] = value;
                this.tryTime = 0;
            }
        }
        const originalMatrix = [...matrix.map(i => [...i])];

        this.generateQuest(matrix);

        return {matrix, originalMatrix};
    };

    generateQuest = matrix => {

        for (let i = 0; i < 18; i++) {
            const x = parseInt(Math.random() * 9);
            const y = parseInt(Math.random() * 9);
            matrix[x][y] = "-";
        }

        return matrix
    };

    generateValue = (matrix, i, j) => {
        const value = parseInt(Math.random() * 9) + 1;
        const x = parseInt(i / 3);
        const y = parseInt(j / 3);

        const startIndexX = range[x][0];
        const endIndexX = range[x][1];

        const startIndexY = range[y][0];
        const endIndexY = range[y][1];

        let error = false;

        for (let a = startIndexX; a <= endIndexX; a++) {
            for (let b = startIndexY; b <= endIndexY; b++) {
                if (matrix[a] && matrix[a][b] === value) {
                    error = true;
                }
            }
        }

        if (!error) {
            for (let a = 0; a <= 8; a++) {
                if ((matrix[a] && matrix[a][j] === value) || (matrix[i] && matrix[i][a] === value)) {
                    error = true;
                }
            }
        }

        if (error) {
            this.tryTime++;
            if (this.tryTime > 1000) {
                return -1
            }
            return this.generateValue(matrix, i, j);
        }
        return value
    };


    generateBorder = (y, x) => {

        const borderTop = (y === 0) || (y % 3 === 0);
        const borderRight = (x === 8) || ((x + 1) % 3 === 0);
        const borderBottom = (y === 8) || ((y + 1) % 3 === 0);
        const borderLeft = (x === 0) || (x % 3 === 0);

        let border = {};

        if (borderTop)
            border.borderTop = "3px solid black";
        else
            border.borderTop = "1px solid black";

        if (borderRight)
            border.borderRight = "3px solid black";
        else
            border.borderRight = "1px solid black";

        if (borderBottom)
            border.borderBottom = "3px solid black";
        else
            border.borderBottom = "1px solid black";

        if (borderLeft)
            border.borderLeft = "3px solid black";
        else
            border.borderLeft = "1px solid black";

        return border;
    };


    selectBox = (index, vindex) => {
        const {matrix} = this.state;
        console.log(index, vindex, matrix[index][vindex]);
        if (matrix[index][vindex] === "-")
            this.setState({selection: [index, vindex]});
    };

    renderTime = () => {
        const {time} = this.state;
        const _mintes = parseInt(time / 60);
        const _seconds = parseInt(time % 60);

        const minutes = _mintes < 10 ? "0" + _mintes : _mintes;
        const seconds = _seconds < 10 ? "0" + _seconds : _seconds;

        return minutes + ":" + seconds;
    };

    render() {
        const {matrix, selection} = this.state;
        const cellSize = 90;
        return (
            <div>
                <div style={{
                    width: "100vw",
                    height: 40,
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <div>Life:{this.state.life}</div>
                    <div>Time:{this.renderTime()}</div>
                </div>
                <div style={{width: (cellSize * 9) + 50}}>
                    {matrix.map((inner, index) =>
                        inner.map((value, vindex) => {
                            return (
                                <div style={{
                                    display: "inline-block",
                                    width: cellSize,
                                    height: cellSize,
                                    backgroundColor: JSON.stringify(selection) === JSON.stringify([index, vindex]) ? "#aaa" : value > -1 ? "#ada" : "white",
                                    ...this.generateBorder(index, vindex)
                                }}
                                     onDoubleClick={() => this.selectBox(index, vindex)}
                                     key={vindex}>
                                    <div className="center" style={{width: "100%", height: "100%"}}>
                                        {value}
                                    </div>
                                </div>
                            )
                        }))}
                </div>
            </div>
        );
    }
}

export default App;
