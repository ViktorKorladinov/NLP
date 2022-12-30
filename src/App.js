import './App.css'
import data from './9ktranslated.json'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useCallback, useEffect, useState } from 'react'
import { saveAs } from 'file-saver'

function App () {
    const [problems, setProblems] = useState([])
    useEffect(() => {
        setProblems(data)
    }, [])

    const [okList, setOk] = useState([])
    const [badList, setBad] = useState([])
    const [counter, setCounter] = useState(0)

    const updateLists = useCallback((newEl, f) => {
        if (f === setBad) setCounter(counter + 1)
        if (counter === 100) {
            setCounter(0)
            let blob = new Blob([JSON.stringify(badList)],
                { type: 'text/plain;charset=utf-8' })
            saveAs(blob, 'data.json')
        }
        f(els => [...els, newEl])
    }, [counter, badList])

    const updateProblems = useCallback(() => {
        const [head, ...tail] = problems
        setProblems(tail)
        return head
    }, [problems])

    function handleClick (event) {
        updateLists(updateProblems(), event.target.id === 'ok' ? setOk : setBad)
    }

    function renderSolved () {
        return [
            { text: 'Ok:', list: okList }, { text: 'Bad:', list: badList }].map(
            item => {
                const { text, list } = item
                if (list.length > 0) {
                    return (<div>{text}
                        <ul>{list.map(
                            prob => <li key={prob.id}>{prob.id}</li>)}</ul>
                    </div>)
                } else return ''
            })
    }

    function renderProblem (problem) {
        return (<Card key={problem['id']} className="MyCard">
            <Card.Header>#{problem.id}</Card.Header>
            <Card.Body>
                <Card.Title>{`Good: ${okList.length} | Bad: ${badList.length} | Overall: ${okList.length + badList.length} | Data: ${data.length}`}</Card.Title>
                <Card.Text>
                    {problem['translated']}
                </Card.Text>
                <Button variant="outline-success" id="ok"
                        onClick={handleClick}>Okay</Button>{' '}
                <Button variant="outline-danger" id="bad" onClick={handleClick}>Contains
                    Knowledge</Button>
            </Card.Body>
            <Card.Footer>
                <small className="text-muted">{problem['equation']} -> {problem["ans"]}</small>
            </Card.Footer>
        </Card>)

    }

    useEffect(() => {
        function handleKeyDown (e) {
            switch (e.keyCode) {
                case 109:
                    //minus
                    updateLists(updateProblems(), setBad)
                    break
                case 107:
                    //plus
                    updateLists(updateProblems(), setOk)
                    break
                case 83:
                    let blob = new Blob([JSON.stringify(badList)],
                        { type: 'text/plain;charset=utf-8' })
                    saveAs(blob, 'data.json')
                    break
                default:
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return function cleanup () {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [updateLists, updateProblems,badList])

    return (<div className="App" tabIndex={0}>
        {problems.length > 0 ? renderProblem(problems[0]) : 'No problems left!'}
        <div className="solved">
            {renderSolved()}
        </div>
    </div>)
}

export default App
