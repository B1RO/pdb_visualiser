import React, {useRef, useEffect} from 'react';
import styled from 'styled-components';

interface CanvasProps {
    width: number;
    height: number;
}

const Canvas = styled.canvas<CanvasProps>`
`;

interface HeatmapProps {
    matrix: number[][];
    width: number;
    height: number;
}

const RootDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Heatmap: React.FC<HeatmapProps> = ({matrix, width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const padding = 100; // adjust this value to your needs
    const gradientHeight = 20;

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.save(); // Save the current state

        // Flip the y-axis
        ctx.translate(0, height);
        ctx.scale(1, -1);

        // Calculate min and max values for normalization
        let minValue = Infinity;
        let maxValue = -Infinity;
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                const value = matrix[y][x];
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
            }
        }

        const cellWidth = (width - padding) / matrix[0].length;
        const cellHeight = (height - padding - gradientHeight) / matrix.length;

        const xStep = Math.ceil(matrix[0].length / 10);
        const yStep = Math.ceil(matrix.length / 10);

        // Draw heatmap
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                // Normalize the value to be between 0 and 1
                const normalizedValue = (matrix[y][x] - minValue) / (maxValue - minValue);

                let color;
                if (normalizedValue <= 0.33) {
                    const adjustedValue = normalizedValue * 3;
                    color = `rgb(${Math.floor(adjustedValue * 255)}, 0, 0)`;
                } else if (normalizedValue <= 0.66) {
                    const adjustedValue = (normalizedValue - 0.33) * 3;
                    color = `rgb(255, ${Math.floor(adjustedValue * 255)}, 0)`;
                } else {
                    const adjustedValue = (normalizedValue - 0.66) * 3;
                    color = `rgb(255, 255, ${Math.floor(adjustedValue * 255)})`;
                }

                ctx.fillStyle = color;
                ctx.fillRect(padding + x * cellWidth, padding + y * cellHeight, cellWidth, cellHeight);
            }
        }

        ctx.restore(); // Restore to the original state

        // Draw axes
        ctx.beginPath();
        ctx.moveTo(padding, 20);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width, height - padding);
        ctx.stroke();

        // Draw indices on x-axis
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (let i = 0; i < matrix[0].length; i += xStep) {
            ctx.fillText(`${i}`, padding + i * cellWidth, height - padding / 2);
        }

        // Draw indices on y-axis
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < matrix.length; i += yStep) {
            ctx.fillText(`${i}`, padding / 2, height - (i * cellHeight + padding));
        }

        // Draw color gradient scale
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgb(0, 0, 0)');
        gradient.addColorStop(1 / 3, 'rgb(255, 0, 0)');
        gradient.addColorStop(2 / 3, 'rgb(255, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 255, 255)');
        ctx.fillStyle = gradient;
        ctx.fillRect(padding, height - padding / 2 - gradientHeight, width - 2 * padding, gradientHeight);

        // Draw scale labels
        ctx.fillStyle = '#000';
        ctx.fillText(minValue.toFixed(2), padding, height - padding / 2 - gradientHeight / 2);
        ctx.fillText(maxValue.toFixed(2), width - padding, height - padding / 2 - gradientHeight / 2);
    }, [canvasRef, matrix, width, height]);

    return (
        <RootDiv>
            <Canvas
                ref={canvasRef}
                width={width}
                height={height}
            />
        </RootDiv>
    );
};

export default Heatmap;
