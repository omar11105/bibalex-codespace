import React from 'react';

function ProblemDetails({ problem }) {
    return (
        <div className="problem-details">
            <h1>{problem.title}</h1>
            <p className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</p>

            <section>
                <h3>Description</h3>
                <p>{problem.description}</p>
            </section>

            {problem.constraints && (
                <section>
                    <h3>Constraints</h3>
                    <ul>
                        {problem.constraints.map((constraint, index) => (
                            <li key={index}>{constraint}</li>
                        ))}
                    </ul>
                </section>
            )}

            {problem.sampleInput && (
                <section>
                    <h3>Sample Input</h3>
                    <pre>{problem.sampleInput}</pre>
                </section>
            )}

            {problem.sampleOutput && (
                <section>
                    <h3>Sample Output</h3>
                    <pre>{problem.sampleOutput}</pre>
                </section>
            )}
        </div>
    );
}

export default ProblemDetails;