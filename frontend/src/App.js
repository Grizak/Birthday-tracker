import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';

function App() {
    const [birthdays, setBirthdays] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            fetch('http://localhost:3000/birthdays', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => setBirthdays(data));
        }
    }, [token]);

    const addBirthday = () => {
        fetch('http://localhost:3000/birthdays', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, date, notes }),
        })
        .then(response => response.json())
        .then(() => {
            setBirthdays([...birthdays, { name, date, notes }]);
            setName('');
            setDate('');
            setNotes('');
        });
    };

    return (
        <div>
            {!token ? (
                <>
                    <Register />
                    <Login setToken={(token) => {
                        setToken(token);
                        localStorage.setItem('token', token);
                    }} />
                </>
            ) : (
                <>
                    <h1>Birthday Tracker</h1>
                    <ul>
                        {birthdays.map((birthday, index) => (
                            <li key={index}>
                                {birthday.name} - {new Date(birthday.date).toLocaleDateString()} ({birthday.notes})
                            </li>
                        ))}
                    </ul>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                    <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
                    <button onClick={addBirthday}>Add Birthday</button>
                </>
            )}
        </div>
    );
}

export default App;
