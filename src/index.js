const express = require('express')
const cors = require('cors')

const { v4:uuidV4, validate: uuidValidate } = require('uuid')
const app = express()

app.use(express.json())
app.use(cors())

const users = []

/**
 * Middleware
 * Confere se o usuario existe
 * retorna o header (username) do usuario
 */
 function checkExistsUserAccount(require, response, next){
    const { username } = require.headers
    const user = users.find(user => user.username === username)
    
    if(!user) response.status(404).json({error: "User not found"})

    require.user = user
    return next()
}
/**
 * Middleware
 * Confere se o TODO existe
 * se existe continua com as funcoes | retorna um erro 404
 */
function checksTodoExists(require,response,next){
    const {user} = require;
    const {id} = require.params;
    // console.log(id)
    const todoExist = user.todo.find(todo => todo.id === id)


    if(!uuidValidate(id)) return response.status(400).json({error:"ID informado incorreto"})

    if(!todoExist) return response.status(404).json({error: 'Todo doesn`t exist!'})

    require.todo = todo
    return next()
}
/**
 * Middleware
 * Encontra o usuario por id passado pelos parametros
 */
function findUserById(require,response,next){
    const { id } = require.params;

    if(!uuidValidate(id)) return response.status(400).json({error:"ID informado incorreto"})

    const userExist = users.find(user => user.id === id)
    
    if(!userExist) return response.status(404).json({error: "User not found"})

    require.user = user

    return next()
}
/**
 * Middleware
 * Deve receber o usuario ja dentro do require(depois do checkExistsUserAccount)
 * e chamar a funcao next apenas se esse usuario estiver no plano gratis e ainda n possuir
 * 10 TODOS cadastradas ou se ele ja estiver no plano Pro 
 */
function checksCreateTodosUserAvailability(require,response,next){
    const { user } = require;
    
    const userFreePlanWithTodos = !user.pro && user.todos.length <= 9
    const userProPlan = user.pro
    
    if(userFreePlanWithTodos || userProPlan) return next()

    return response.status(403).json({ message: "Already use all TODOS available" }) 

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
app.get('/users/:id', findUserById,(require,response)=>{
    const {user} = require
    response.status(200).json({user})
})
app.route('/users')
    .post((require,response)=>{
        // const {username} = require.headers
        const {name, username} = require.body

        /**
         * Testa para ver se o usuario ja existe
         */
        const userAlreadyExist = users.some(user => user.username === username)

        userAlreadyExist ? response.status(400).json({error: 'User already exist!'}) : ''

        const user = users.push({
            id: uuidV4(),
            name: name,
            username: username,
            pro: false,
            todos: []
        })
        return response.status(201).json(user)
    })

/**
 * Todas as requisicoes feitas posteriormente a este
 * app.use serao verificadas pelo middleware
 */
 app.use(checkExistsUserAccount)

app.route('/todos').get((require,response)=>{
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
app.post('/todos',checkExistsUserAccount,checksCreateTodosUserAvailability,(require,response)=>{
        const {user} = require
        const {title, deadline} = require.body

        const newTodo = {
            id: uuidV4(),
            title,
            deadline: new Date(deadline),
            created_at: new Date(),
            status: false
        }

        user.todo.push(newTodo)

        return response.status(201).json({message:"Todo added successfully!"})
})
/**
 * Todas as requisicoes feitas posteriormente a este
 * app.use serao verificadas pelo middleware
 */
 app.use("/todos/:id",checksTodoExists)
/**
 * Recebe: 
 * title: string
 * deadline: string
 * Para fazer a atualizacao dos dados, somente da todo com id deste usuario
 */
app.route("/todos/:id").put((require,response)=>{
    const {todo} = require
    const {title, deadline} = require.body

    if(title) todo.title = title
    if(deadline) todo.deadline = new Date(deadline)

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

app.use("/todos/:id/done",checksTodoExists)
/**
 * faz a atualizacao dos dados, somente da todo com id deste usuario
 */
app.patch("/todos/:id/done",(require,response)=>{
    const {todo} = require
    todo.status = true

    return response.status(200).json({message: "Data Upgraded successfully"})
})
/**
 * Criando porta e escutando todas as requisicoes feitas para a mesma
 */
const port = 3000
app.listen(port)


module.exports = {
    app,
    users,
    checksExistsUserAccount,
    checksCreateTodosUserAvailability,
    checksTodoExists,
    findUserById
};

