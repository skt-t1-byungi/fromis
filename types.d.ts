/* eslint-disable */
interface Thenable<T> {
    then<V1,V2=never>(thener?: (val:T)=>V1|Thenable<V1>, catcher?: (err:any)=>V2|Thenable<V2>):Thenable<V1|V2>,
    catch<V>(catcher: (err:any)=>V|Thenable<V>):Thenable<V>,
}

declare function promise<V>(exec: (resolve:(v:V|Thenable<V>)=>void, reject: (err?:any)=>void)=>void):Thenable<V>

export default promise
