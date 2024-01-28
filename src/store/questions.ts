import {create} from 'zustand'
import { Question } from './../types/types.d';

// Describir como se compondrá el estado
interface State {
    questions: Question[]
    currentQuestion: number
    fetchQuestions: (limit: number) => Promise<void>
    selectAnswer: (questionId: number, answerIndex: number) => void
    goNextQuestion: () => void
    goPrevQuestion: () => void
}

export const useQuestionsStore = create<State>((set, get) => {
    // get (leer estado) - set (actualizar estado)
    return {
        questions: [],
        currentQuestion: 0, // posicion del arrray de Questions

        fetchQuestions: async (limit: number) => {
            const res = await fetch('http://localhost:5173/data.json')
            const json = await res.json()

            const questions = json.sort(()=> Math.random() - 0.5).slice(0, limit)
            set({questions})
        },

        selectAnswer: (questionId:number, answerIndex: number) => {
            const {questions} = get() // Recuperar valor del estado
            // usar el structuredClone para clonar el objeto
            // Copiar todas las preguntas, para cambiar solo la que se ha respondido
            const newQuestions = structuredClone(questions)
            
            // Obtener index de la pregunta
            const questionIndex = newQuestions.findIndex(question => question.id === questionId)

            // Obtener datos de la pregunta
            const questionInfo = newQuestions[questionIndex]

            // Checar si la respuesta es correcta
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex

            // Cambiar la información en la copia de la pregunta
            newQuestions[questionIndex] = {
                ...questionInfo,
                isCorrectUserAnswer,
                userSelectedAnswer: answerIndex
            }
            // Actualizar estado
            set({questions: newQuestions})

        },

        goNextQuestion: () => {
            const {currentQuestion, questions} = get()

            const nextQuestion = currentQuestion + 1

            if(nextQuestion < questions.length) {
                set({currentQuestion: nextQuestion})
            }
        },

        goPrevQuestion: () => {
            const {currentQuestion } = get()

            const prevQuestion = currentQuestion - 1

            if(prevQuestion >= 0) {
                set({currentQuestion: prevQuestion})
            }
        }
    }
})