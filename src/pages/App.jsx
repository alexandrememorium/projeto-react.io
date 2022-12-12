import './App.css'
import { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format';
import loading from '../img/loading.svg';
import api from './api';
import axios from 'axios';



function UserList(){
    let [usuarios, setusuarios] = useState([])

    
    useEffect(() => {
        setTimeout(() => { 
        api.get('5d531c4f2e0000620081ddce', {          
            method: 'GET',
        })
        .then((resp) => {
            setcarregamento("none")
            setusuarios(resp.data)
        })
    },100)
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
//    let [pagamento, setpagamento] = useState([]); // abrir pagamento
    let [pagadorNome, setpagadorNome] = useState(""); //  pegar nome usuário
    let [pagadorId, setpagadorId] = useState(""); //  pegar id usuário
    let [resultado, setresultado] = useState("none"); // abrir recebimento
    let [carregamento, setcarregamento] = useState("flex"); // abrir carregamento
    let [pagamentoError, setpagamentoError] = useState(""); // mostrar o não do recebimento
    let [valorCartao, setvalorCartao] = useState("1"); // valor do selection
    let [valorDinheiro, setvalorDinheiro] = useState(""); // valor do dinheiro
    let [obrigatorio, setobrigatorio] = useState("none"); // validação de campo
    let [liberabotao, setliberabotao]= useState(false);

    // Abrir o modal
    function modalPayOpen (e){
        //setpagamento("flex")
        setpagadorNome(e.name)
        setpagadorId(e.id)
        //setpagamento(e)
        setliberabotao(true)
    }

    // Função para dinheiro
    function inputChange(e){
        setvalorDinheiro(e.target.value);
        setobrigatorio("none");
    }

    // Modal recibo de pagamento
    function modalresultOpen(cartao, valor, id){
        if (valorDinheiro === ""){
            setobrigatorio("flex");
        }
        else{
			let payload = {
				"card_number": cards[cartao-1].card_number,
				"cvv": cards[cartao-1].cvv,
				"expiry_date": cards[cartao-1].expiry_date,
				// Destination User ID
				"destination_user_id": id,
				// Value of the Transaction
				"value": valor
			}
			console.log("payload ", payload);
			
			axios.post(`https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989`, { payload })
				.then(res => {
					console.log(res);
					console.log(res.data);
                })
            
            if (valorCartao === "1"){
                setpagamentoError("");
            } else{
                setpagamentoError("não");
            }

            //setpagamento("none");
            setresultado("flex");
            setvalorDinheiro("");
            setobrigatorio("none");
        }
        
    }
    
    // Fechamento do modal
   function modalClose (){
        setresultado("none");
        setliberabotao(false); 
        setpagadorNome("");       
        setpagadorId("");
    }

    function modalClosePag (){
        setvalorDinheiro("");
        setobrigatorio("none");        
        //setpagamento("none");
        setpagadorNome("");
        setpagadorId("");        
        setliberabotao(false);
    }

   // Retornando o conteúdo que será renderizado em tela
   // Função map percorrendo todo o array recuperado anteriormente com o axios e listando na tela cada linha do array
    return(
        <>
        {usuarios.map((t, index) =>{
            return (
              <div className="user-container" key={'user'+index}>
                <div className="user-wrapper">
                    <img className="user-thumbnail" src={t.img} alt=""/>
                    <div className="user-data">
                        <p>Nome do Usuário: {t.name}</p>
                        <p>ID: {t.id} - Username: {t.username}</p>
                    </div>
                    <button type="submit" onClick={()=>{modalPayOpen(t)}} disabled={liberabotao}>Pagar</button>
                </div>
            </div>
            )
        })}
         {/* ----------------Modal para o pagamento------------ */}
         { pagadorNome &&
         <div className="modal">
                <span>Pagamento para <b>{pagadorNome}</b></span>
                <div className="input-money">
                    <NumberFormat 
                            thousandSeparator="." 
                            decimalSeparator="," 
                            decimalScale={2}
                            fixedDecimalScale 
                            value={valorDinheiro} 
                            onChange={inputChange} 
                            prefix={'R$ '} 
                            inputmode="numeric" 
                            placeholder="R$ 0,00"
                            />
                    <p style={{display:obrigatorio}}>Campo obrigatório</p>
                </div>
                <select value={valorCartao} onChange={handleChange}>
                    <option value="1">Cartão com final {cards[0].card_number.substr(-4)}</option>
                    <option value="2">Cartão com final {cards[1].card_number.substr(-4)}</option>
                </select>
                <div className="input-button">
                   <button onClick={()=>{modalresultOpen(valorCartao, valorDinheiro, pagadorId)}}>Pagar</button>
                   <button onClick={()=>{modalClosePag()}}>Fechar</button>
                </div>
            </div>
            }
            {/* -------------Modal de recibo de pagamento------------ */}
            <div className="modal" style={{display: resultado}}>
                <span>Recibo de pagamento</span>
                <p>O Pagamento <strong>{pagamentoError}</strong> foi concluido com sucesso</p>
                <button onClick={()=>{modalClose()}}>Fechar</button>
            </div>
            {/* -------------Modal de CARREGAMENTO------------ */}
            <div className="modal" style={{display: carregamento}}>
                <span>Carregando .......</span>
                <img src={loading} alt="Loading" width="20%"></img>
                <p> <strong>Aguarde Sistema Carregando....</strong></p>
            </div>            
      </>
    )
}
export default UserList;