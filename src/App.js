import React from 'react';
import logo from './logo.svg';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Http, NoteAdd, Schedule, Email } from '@material-ui/icons';

import './App.css';
import Hooks from './pages/hook-page/hook-page';
import AddLessonPage from './pages/add-lesson-page/add-lesson-page';
import GetLessonsPage from './pages/get-lessons-page/get-lessons-page';
import SendMessagePage from './pages/send-message-page/send-message-page';

export const HooksContext = React.createContext();

function App() {
  const [hooks, setHooks] = React.useState([]);
  const [value, setValue] = React.useState("addlesson");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    fetch('/hooks')
        .then(response => response.json())
        .then(result => {
          setHooks(result.hooks)
        });
  }, []);

  // TODO: Скрывать навигацию для неавторизованного пользователя
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Планировщик расписания</h1>
        <img src={logo} className="App-logo-right" alt="logo" />
        <span className="author">created by vovachebr</span>
      </header>
      <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction label="Создать занятие" value="addlesson" icon={<NoteAdd/>} />
          <BottomNavigationAction label="Расписание занятий" value="getlessons" icon={<Schedule/>} />
          <BottomNavigationAction label="Отправить" value="sendmessage" icon={<Email/>} />
          <BottomNavigationAction label="Хуки" value="hooks" icon={<Http/>} />
      </BottomNavigation>
      <HooksContext.Provider value={{hooks, updateHooks: (hooks) => setHooks(hooks)}}>
      {value === "addlesson" && <AddLessonPage /> }
      {value === "getlessons" && <GetLessonsPage /> }
      {value === "sendmessage" && <SendMessagePage /> }
      {value === "hooks" && <Hooks /> }
      </HooksContext.Provider>
    </div>
  );
}

export default App;
