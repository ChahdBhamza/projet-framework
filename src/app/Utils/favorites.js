export function GetFavorites(){
    if( typeof window ==="undefined")return[];
    return JSON.parse(localStorage.getItem("favorites")||"[]");
}
export function AddFavorites(id){
    if( typeof window ==="undefined")return;
    const current=GetFavorites();
    if(current.includes(id))return;
    const updated=[...current,id];
    localStorage.setItem("favorites",JSON.stringify(updated));
}

export function RemoveFavorites(id){
    if( typeof window ==="undefined")return;
    const current=GetFavorites();
    const updated=current.filter(favId => favId !== id);
    localStorage.setItem("favorites",JSON.stringify(updated));
}