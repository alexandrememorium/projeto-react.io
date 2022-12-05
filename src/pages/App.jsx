import './App.css'
import { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format';
import api from './api';

function UserList(){
    let [tarefas, setTarefas] = useState([])
    useEffect(() => {
        api.get('5d531c4f2e0000620081ddce', {          
            method: 'GET',
        })
        .then((resp) => {setTarefas(resp.data)})
    }, [])

    // lista dos cartoes
    let cards = [
        // cartão valido
        {
          card_number: '1111111111111111',
          cvv: 789,
          expiry_date: '01/18',
        },
        // cartão invalido
        {
          card_number: '4111111111111234',
          cvv: 123,
          expiry_date: '01/20',
        },
      ];

    // Função para olhar modificação e recuperar valor no selection
    function handleChange(event){
        setvalorCartao(event.target.value);
    }

    // Constante de ação dos modals
    let [pagamento, setpagamento] = useState("none"); // abrir pagamento
    let [pagadorNome, setpagadorNome] = useState(""); //  pegar nome usuário
    let [resultado, setresultado] = useState("none"); // abrir recebimento
    let [pagamentoError, setpagamentoError] = useState(""); // mostrar o não do recebimento
    let [valorCartao, setvalorCartao] = useState("1"); // valor do selection
    let [valorDinheiro, setvalorDinheiro] = useState(""); // valor do dinheiro
    let [obrigatorio, setobrigatorio] = useState("none"); // validação de campo

    // Abrir o modal
    function modalPayOpen (name){
        setpagamento("flex")
        setpagadorNome(name)
    }

    // Função para dinheiro
    function inputChange(e){
        setvalorDinheiro(e.target.value);
        setobrigatorio("none");
    }

    // Modal recibo de pagamento
    function modalresultOpen (){
        if (valorDinheiro === ""){
            setobrigatorio("flex");
        }
        else{
            if (valorCartao === "1"){
                setpagamentoError("");
            } else{
                setpagamentoError("não");
            }
            setpagamento("none");
            setresultado("flex");
            setvalorDinheiro("");
            setobrigatorio("none");
        }
        
    }
    
    // Fechamento do modal
   function modalClose (){
        setresultado("none");
    }

   // function modalClosePag (){
   //     setpagamento("none");
   // }

   // Retornando o conteúdo que será renderizado em tela
   // Função map percorrendo todo o array recuperado anteriormente com o axios e listando na tela cada linha do array
    return(
        <>
        {tarefas.map((t, index) =>{
            return (
            <div className="user-container" key={'user'+index}>
                <div className="user-wrapper">
                    <img className="user-thumbnail" src={t.img} alt=""/>
                    <div className="user-data">
                        <p>Nome do Usuário {t.name}</p>
                        <p>ID: {t.id} - Username: {t.username}</p>
                    </div>
                    <button onClick={()=>{modalPayOpen(t.name)}}>Pagar</button>
                </div>
            </div>
            )
        })}
         {/* ----------------Modal para o pagamento------------ */}
         <div className="modal" style={{display: pagamento}}>
                <span>Pagamento para <b>{pagadorNome}</b></span>
                <div className="input-money">
                    <NumberFormat thousandSeparator={true} value={valorDinheiro} onChange={inputChange} prefix={'R$ '} inputmode="numeric" placeholder="R$ 0,00"/>
                    <p style={{display:obrigatorio}}>Campo obrigatório</p>
                </div>
                <select value={valorCartao} onChange={handleChange}>
                    <option value="1">Cartão com final {cards[0].card_number.substr(-4)}</option>
                    <option value="2">Cartão com final {cards[1].card_number.substr(-4)}</option>
                </select>
                <button onClick={()=>{modalresultOpen ()}}>Pagar</button>
                {/*<button onClick={()=>{modalClosePag()}}>Fechar</button> */}               
            </div>

            {/* -------------Modal de recibo de pagamento------------ */}
            <div className="modal" style={{display: resultado}}>
                <span>Recibo de pagamento</span>
                <p>O Pagamento <strong>{pagamentoError}</strong> foi concluido com sucesso</p>
                <button onClick={()=>{modalClose()}}>Fechar</button>
            </div>
      </>
    )
}
export default UserList;