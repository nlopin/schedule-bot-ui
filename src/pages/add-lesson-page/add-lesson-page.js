import React from 'react';
import { withSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Stars } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DateTimePicker
} from '@material-ui/pickers';
import { HooksContext } from '../../App';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 500,
  },
  page: {
    display: "flex",
    justifyContent: "space-around"
  },
  column: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "40%"
  },
  pre: {
    display: "block",
    padding: "9.5px",
    margin: "0 0 10px",
    wordBreak: "break-all",
    wordWrap: "break-word",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ccc",
    borderRadius: "10px",
    whiteSpace: "pre-wrap",
    textAlign: "initial"
  },
  messageConstructor: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between"
  },
  sendButton: {
    marginTop: "10px",
  }
}));

function AddLessonPage({enqueueSnackbar}) {
  const classes = useStyles();

  const [hook, setHook] = React.useState('');
  const [lecture, setLecture] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [lector, setLector] = React.useState("");
  const [additional, setAdditional] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const getDate = () => {
    const options = {
      month: 'numeric',
      day: 'numeric'
    };
    let todayDay = selectedDate.toLocaleString("ru", options);
    const getMounth = (num) => [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"][num];
    const splittedData = todayDay.split(".");
    splittedData[1] = getMounth(+splittedData[1] - 1);
    return splittedData.join(' ');
  }

  const getTime = () => {
    const options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return selectedDate.toLocaleString("ru", options);
  }

  const getLastLesson = () => {
    fetch(`/lessons/getLastLecture?lecture=${lecture}`)
    .then(response => response.json())
    .then(result => {
      debugger;
      if(result.success && result.lesson){
        setLecture(result.lesson.lecture);
        setLector(result.lesson.teacher);
        setAdditional(result.lesson.additional);
        setImageUrl(result.lesson.imageUrl);
      }else{
        enqueueSnackbar(result.error || "Занятие не было найдено", { variant: 'error' });
      }
    });
  }

  const createLesson = () => {
    const data = {
      group: hook.group,
      date: selectedDate.toISOString().slice(0,10),
      time: getTime(),
      teacher: lector,
      lecture,
      additional,
      imageUrl
    }
    fetch('/lessons/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if(result.success){
        enqueueSnackbar("Успешно добавлено", { variant: 'success' });
        setHook("");
        setLecture("");
        setSelectedDate("");
        setLector("");
        setAdditional("");
        setImageUrl("");
      }else{
        enqueueSnackbar(result.error, { variant: 'error' });
      }
    });
  }

  return (
    <HooksContext.Consumer>
    {data => (
    <div className={classes.page}>
      <div className={classes.column}>
          <h1>Конструктор сообщения:</h1>
          <div className={classes.messageConstructor}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                Группа/канал
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={hook}
                onChange={event => setHook(event.target.value)}
                labelWidth={labelWidth}
                >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {
                  data.hooks.map(h => <MenuItem value={h} key={h.value}>Группа: "{h.group}", канал: "{h.channel}".</MenuItem>)
                }
              </Select>
            </FormControl>
            <TextField label="Название занятия" variant="outlined" value={lecture} onChange={event => setLecture(event.target.value)} />
            <Button variant="outlined" color="primary" onClick={getLastLesson}>
              Попробовать получить уже существующее занятие
              <Stars />
            </Button>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                variant="inline"
                format="dd-MM-yyyy HH:mm"
                autoOk={true}
                minutesStep={5}
                ampm={false}
                margin="normal"
                label="Дата и время занятия"
                disablePast={true}
                value={selectedDate}
                onChange={date => setSelectedDate(date)}
              />
            </MuiPickersUtilsProvider>
            <TextField
              label="Лектор"
              variant="outlined"
              value={lector}
              onChange={event => setLector(event.target.value)}
            />
            <TextareaAutosize 
              aria-label="minimum height"
              rowsMin={5}
              rowsMax={10}
              placeholder="Обсужтаемые темы"
              value={additional}
              onChange={event => setAdditional(event.target.value)}
            />
            <TextField
              label="Ссылка на изображение"
              variant="outlined"
              value={imageUrl}
              onChange={event => setImageUrl(event.target.value)}
            />
          </div>
      </div>
      <div className={classes.column}>
        <h1>Результат сообщения:</h1>
        <h2>Группа: {hook.group || "не задана"}</h2>
        <h2>Сообщение:</h2>
              <pre className={classes.pre}>
{`@channel
Добрый день!
Сегодня, ${getDate()}, в ${getTime()} по московскому времени состоится лекция «${lecture}».
Ее проведет ${lector}.
${additional} \n\n
Ссылку на трансляцию вы найдете в личном кабинете и в письме, которое сегодня придет вам на почту за два часа до лекции.`}
              </pre>
        <img alt="изображение отсутствует" width="500px" height="250px" src={imageUrl} />
        <Button variant="contained" className={classes.sendButton} onClick={createLesson}>Создать занятие</Button>
      </div>
    </div>
    )}
    </HooksContext.Consumer>
  );
}

export default withSnackbar(AddLessonPage);
