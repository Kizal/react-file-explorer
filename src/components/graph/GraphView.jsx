import { useEffect, useRef, useState } from 'react';
import { useFileExplorer } from '../../context/FileExplorerContext';

const GraphView = () => {
    const { state, navigateToFolder } = useFileExplorer();
    const canvasRef = useRef(null);
    const [nodes, setNodes] = useState([]);

    // Simple implementation: Traverse tree and layout nodes
    // For a real app, use D3 or React Flow. Here we build a simple tree visualization.

    useEffect(() => {
        if (!state.files.length) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.parentElement.clientWidth;
        const height = canvas.height = Math.max(600, canvas.parentElement.clientHeight);

        ctx.clearRect(0, 0, width, height);

        // Flatten tree with levels for layout
        // Only show expanded folders or just full tree? Let's show full tree connected.

        const calculatedNodes = [];
        const edges = [];

        const traverse = (items, depth = 0, xRange = [0, width], parentId = null, y = 50) => {
            const count = items.length;
            if (count === 0) return;

            const slice = (xRange[1] - xRange[0]) / count;

            items.forEach((item, index) => {
                const x = xRange[0] + slice * index + slice / 2;

                calculatedNodes.push({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    x,
                    y
                });

                if (parentId) {
                    edges.push({ from: parentId, to: item.id });
                }

                if (item.children && item.children.length > 0) {
                    // Only traverse reasonably deep to avoid chaos
                    if (depth < 4) {
                        traverse(item.children, depth + 1, [x - slice / 2, x + slice / 2], item.id, y + 100);
                    }
                }
            });
        };

        traverse(state.files); // Start with root
        setNodes(calculatedNodes);

        // Draw Edges
        ctx.strokeStyle = '#9ca3af'; // var(--text-secondary)
        ctx.lineWidth = 1;

        edges.forEach(edge => {
            const from = calculatedNodes.find(n => n.id === edge.from);
            const to = calculatedNodes.find(n => n.id === edge.to);
            if (from && to) {
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            }
        });

        // Draw Nodes
        calculatedNodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = node.type === 'folder' ? '#fbbf24' : '#3b82f6'; // yellow or blue
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(node.name, node.x, node.y + 35);
        });

    }, [state.files]);

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Simple hit detection
        const clickedNode = nodes.find(node => {
            const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
            return dist <= 20; // radius
        });

        if (clickedNode && clickedNode.type === 'folder') {
            navigateToFolder(clickedNode.id);
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default GraphView;
