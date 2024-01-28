export const getAllQuestions = async (limit: number) => {
    const res = await fetch('http://localhost:5173/data.json')
    const json = await res.json()

    const questions = json.sort(()=> Math.random() - 0.5).slice(0, limit)

    return questions
}