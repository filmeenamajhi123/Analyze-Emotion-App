import {Routes, Route } from 'react-router-dom'
import EmotionForm from './components/EmotionForm'
import EmotionResult from './components/EmotionResult'

function App() {
  return (
      <Routes>
        <Route path='/' element={<EmotionForm/>}/>
        <Route path='/result' element={<EmotionResult/>}/>
      </Routes>
  )
}

export default App
