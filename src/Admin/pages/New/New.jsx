
import { useEffect, useState } from "react";


const New = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const[search,setsearch]=useState("")
  const [filter,setfilter]=useState("")

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);
      const result = products.filter((prodect)=>prodect.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a,b)=>{
        if(sort==="low"){
          return a.price - b.price
        }
         if(sort==="high"){
          return b.price - a.price
        }
        return 0
      })
      .filter((product)=>{
        if(filter===""){
          return true
        }
        return product.category === filter
      })
      const averagePrice =
  products.length > 0
    ? products.reduce((total, product) => total + product.price, 0) /
      products.length
    : 0;
 
 

  return (
    <div>
      <div>
  <input
    value={search}
    onChange={(e) => setsearch(e.target.value)}
    placeholder="Search..."
    style={{
      borderRadius: "6px",
      border: "1px solid black",
      padding: "1px",
    }}
  />
</div>

      <select value={sort} 
      onChange={(e)=>setSort(e.target.value)}>
        <option value="">sort</option>
        <option value="low">low</option>
        <option value="high">high</option>
      </select>

      <select
      value={filter}
      onChange={(e) => setfilter(e.target.value)}>
        <option value="">All</option>
        <option value="Birthday Cakes">Cake</option>
        <option value="Pastries">Pastry</option>
        <option value="Desserts">Cupcake</option>
      </select>
      

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
       
        {result.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "black",
              color: "white",
              width: "250px",
              padding: "20px",
            }}
          >
            <h2>{product.name}</h2>
            <p>{product.category}</p>

            <p>₹{product.price}</p>

            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
      <div>
  <h2>Average Price: ₹{averagePrice.toFixed(2)}</h2>
</div>
    </div>
  );
};

export default New; 

