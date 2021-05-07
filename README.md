### ToDo API
Uma API para desenvolvimento de uma lista de afazeres de forma fácil e rápida
_______________________________________________________________________________________________________________________________________________

### Explicação
Esta API foi feita através de um desafio de conceitos básicos de Node.JS, feito pela escola RocketSeat
_______________________________________________________________________________________________________________________________________________

### Conteúdo
Essa aplicação será uma aplicação para gerenciar tarefas.
É permitido a criação de um usuário com NAME e USERNAME, bem como fazer um CRUD de Todos, dentro de um Array de usuários:

* Criar um novo TODO;
* Listar todos os TODO;
* Alterar o TITLE e DEADLINE de um todo existente;
* Marcar um TODO como feito;
* Excluir um TODO.

Tudo isso para cada usuário específico (o username será passado pelo Header)
_______________________________________________________________________________________________________________________________________________

### Requerimentos

* node instalado na máquina [NODE.JS](https://nodejs.org/en/download/)
* express
* uuid
_______________________________________________________________________________________________________________________________________________

### Comandos

### GET /users/:id
* Faz a procura de um usuário atravéz da passagem de um id via GET

### POST /users
* BODY
    { 
      id: 'uuid', // precisa ser um uuid
      name: 'Danilo Vieira', 
      username: 'danilo', 
      todos: []
    }
Criará um usuário

### Todas as próximas requisições necessitam do username para ter sucesso nas mesmas

### GET /todos
* Esta rota deve receber um header com a propriedade username contendo o username do usuário criado anteriormente

### POST /todos
* BODY
    { 
      title: 'Nome da tarefa',
	    deadline: 'ANO-MES-DIA', 
    }
Será criada uma TODO da seguinte forma:
{ 
	id: 'uuid', // precisa ser um uuid
	title: 'Nome da tarefa',
	status: false, 
	deadline: new Date(deadline), 
	created_at: new Date()
}

### Todas as próximas requisições Conferem se existe a TODO que esta sendo procurada

* Esta roda recebe no body os dados a serem atualizados


### PUT /todos/:id
* BODY
    { 
      title: 'Nome da tarefa',
	    deadline: 'ANO-MES-DIA', 
    }

 Esta rota Atualiza o Status da TODO, para true, 
 determinada pelo params.id da requisição


### PACTH /todos/:id/done

 Esta rota Deleta a TODO 
 determinada pelo params.id da requisição

### DELETE /todos/:id
_______________________________________________________________________________________________________________________________________________
### Contatos

* felipe@gazapina.com.br
* [NÚMERO](https://wa.link/gwodu2)


