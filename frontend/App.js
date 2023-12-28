import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import StudentHome from './pages/StudentHome';
import AdminHome from './pages/AdminHome';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import AdminEditMaze from './pages/AdminEditMaze';
import UserAttemptMaze from './pages/UserAttemptMaze';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/editMaze' element={<AdminEditMaze></AdminEditMaze>}/>
          <Route path='/adminHome' element={<AdminHome />} />
          <Route path='/homepage' element={<StudentHome />} />
          <Route path='/attemptMaze' element={<UserAttemptMaze />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
