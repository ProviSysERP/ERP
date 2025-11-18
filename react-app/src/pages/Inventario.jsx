import {useState, useEffect} from 'react';
import Header from '../components/Header.jsx'

export default function Inventario() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

}
