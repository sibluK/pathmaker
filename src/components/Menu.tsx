import '../styles/menu.css'

type MenuProps = {
    numberOfNodes: number,
    numberOfConnections: number,
    error: string,
    SolveUsingBFS: () => void,
    SolveUsingDFS: () => void,
    Clear: () => void
}

export default function Menu({ numberOfNodes, numberOfConnections, Clear, SolveUsingBFS, SolveUsingDFS, error }: MenuProps) {
    return (
        <div className="menu-wrapper">
            <div className='information-wrapper'>
                <h3>Information</h3>
                <span>Number of Nodes: {numberOfNodes}</span>
                <span>Number of Connections: {numberOfConnections}</span>
                <button className='bfs-button' onClick={SolveUsingBFS}>BFS</button>
                <button className='dfs-button' onClick={SolveUsingDFS}>DFS</button>
                <button onClick={Clear}>Clear</button>
                {error && (
                    <span className='error'>{error}</span>
                )}
            </div>
            <div className='instructions-wrapper'>
                <h3>Instructions</h3>
                <div className='instruction'>
                    <span >Add Node</span>
                    <span>—&gt;</span>
                    <span>Left-Click</span>
                </div>
                <div className='instruction'>
                    <span>Mark Start Node</span>
                    <span>—&gt;</span>
                    <span>Right-Click</span>
                </div>
                <div className='instruction'>
                    <span>Mark End Node</span>
                    <span>—&gt;</span>
                    <span>Scroll-Click</span>
                </div>
                <div className='instruction'>
                    <span>Choose an algorithm</span>
                </div>

                <div className='instruction'>
                    <span>Click on created node to make connections</span>
                </div>
            </div>
            <div className='algorithm-wrapper'>
                <h3>Algorithms</h3>
                <a target='_blank' href='https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/#what-is-breadth-first-search' className='link-to-algorithm'><span>Breadth First Search (BFS)</span></a>
                <a target='_blank' href='https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/' className='link-to-algorithm'><span>Depth First Search (DFS)</span></a>
            </div>

        </div>
        
    )
}