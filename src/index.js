const express = require('express')
const cors = require('cors')

const { v4:uuidV4 } = require('uuid')
const app = express()

app.use(express.json())

/**
 * Middleware
 * Confere se o usuario existe
 * retorna o header (username) do usuario
 */
 function checkExistsUserAccount(req, res, next){
    const { username } = req.headers
    const user = users.find(user => user.username === username)
    
    !user ? res.status(404).json({error: "User not found"}): ''

    req.user = user
    return next()
}
function checkExistTodo(req,res,next){
    const {user} = req

    const todoExist = user.todo.some(todo => todo.id === id)
    !todoExist? res.status(404).json({error: 'Todo doesn`t exist!'}) : ''

    return next()
}

/**
 * user deve conter ->
 *  ID: uuidV4()
 *  NAME: string
 *  UserName: string
 *  TODO: [
 *      status
 *      title
 *      deadline
 *  ]
 */
const users = []

app.route('/Users')
    .post((require,response)=>{
        const {username} = require.headers
        const {name} = require.body

        /**
         * Testa para ver se o usuario ja existe
         */
        const userAlreadyExist = users.some(user => user.username === username)

        userAlreadyExist ? response.status(400).json({error: 'User already exist!'}) : ''

        users.push({
            id: uuidV4(),
            name: name,
            username: username,
            todo: []
        })
        console.log(users)
        return response.status(201).json({message: "User created successfully"})
    })

/**
 * Todas as requisicoes feitas posteriormente a este
 * app.use serao verificadas pelo middleware
 */
 app.use(checkExistsUserAccount)
/**
 * Criando porta e escutando todas as requisicoes feitas para a mesma
 */

app.route('/todo').get((require,response)=>{
    const { user } = require

    return response.status(200).json({
            message: "Todos was founded!",
            todos: user.todo 
        })
})
/**
 * Recebe: 
 * id: uuidV4
 * title: string
 * deadline: string
 * created_at: new Date()
 * status: boolean (false = not done | true = done)
 */
    .post((require,response)=>{
        const {user} = require
        const {title, deadline} = require.body

        const dataTodo = {
            id: uuidV4(),
            title,
            deadline: new Date(deadline),
            created_at: new Date(),
            status: false
        }

        user.todo.push(dataTodo)

        return response.status(201).json({message:"Todo added successfully!"})
})
/**
 * Todas as requisicoes feitas posteriormente a este
 * app.use serao verificadas pelo middleware
 */
 app.use(checkExistTodo)
/**
 * Recebe: 
 * title: string
 * deadline: string
 * Para fazer a atualizacao dos dados, somente da todo com id deste usuario
 */
app.route("/todo/:id").put((require,response)=>{
    const {user} = require
    const {id} = require.params
    const {title, deadline} = require.body

    const todoForUpdate = user.todo.find(todo => todo.id === id)

    todoForUpdate.title = title
    todoForUpdate.deadline = new Date(deadline)

    return response.status(200).json({message: "Data Upgraded successfully"})
})
/**
 * Faz a delecao da todo de acordo com seu id
 */
    .delete((require,response)=>{
        const {user} = require
        const {id} = require.params

        user.todo.splice(id,1)
        
        return response.status(200).json({
            message: "Data was Deleted successfully",
            todo: user.todo
        })
    })
/**
 * faz a atualizacao dos dados, somente da todo com id deste usuario
 */
app.patch("/todo/:id/done",(require,response)=>{
    const {user} = require
    const {id} = require.params

    const todoForUpdate = user.todo.find(todo => todo.id === id)

    todoForUpdate.status = true

    return response.status(200).json({message: "Data Upgraded successfully"})
})
const port = 3000
app.listen(port)

