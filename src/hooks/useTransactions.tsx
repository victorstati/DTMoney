import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { api } from '../services/api';

interface Transaction{
    id: number;
    title: string;
    amount: number;
    category: string;
    type: string;
    createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps{
    children: ReactNode;
}

interface TransactionsContextData{
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider({children}: TransactionsProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        api.get('transactions')
        .then(resp => setTransactions(resp.data.transactions))
    }, []);

    async function createTransaction(transactionInput: TransactionInput){
        const resp = await api.post('/transactions', {...transactionInput, createdAt: new Date})
        const {transaction} = resp.data;
        setTransactions([...transactions, transaction]);
    }

    return (
        <TransactionsContext.Provider value={{transactions, createTransaction}}>
            {children}
        </TransactionsContext.Provider>
    );
}

export function useTransactions(){
    const context = useContext(TransactionsContext);

    return context;
}