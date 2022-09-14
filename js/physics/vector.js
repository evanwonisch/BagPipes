class Vector3{
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(vector){
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z)
    }
    sub(vector){
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z)
    }
    mul(scalar){
        return new Vector3(this.x * scalar, this.y * scalar, this.z*scalar)
    }
    div(scalar){
        return new Vector3(this.x / scalar, this.y / scalar, this.z/scalar)
    }
    norm(){
        return Math.sqrt(this.x * this.x + this.y * this.y+ this.z * this.z);
    }
    toColor(){
        return "rgb("+this.x+","+this.y+","+this.z+")"
    }
    toUnitVector(){
        if(this.norm() != 0){
            return this.div(this.norm())
        }else {
            return new Vector3();
        }
    }
    dot(vector){
        return this.x * vector.x + this.y*vector.y + this.z*vector.z;
    }
    static random(){
        return new Vector3(Math.random(), Math.random(), Math.random())
    }
}

class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
    add(vector){
        return new Vector2(this.x + vector.x, this.y + vector.y)
    }
    sub(vector){
        return new Vector2(this.x - vector.x, this.y - vector.y)
    }
    mul(scalar){
        return new Vector2(this.x * scalar, this.y * scalar)
    }
    div(scalar){
        return new Vector2(this.x / scalar, this.y / scalar)
    }
    norm(){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    toUnitVector(){
        if(this.norm() != 0){
            return this.div(this.norm())
        }else {
            return new Vector2();
        }
    }
    dot(vector){
        return this.x * vector.x + this.y*vector.y;
    }
    cross(vector){
        return this.x * vector.y - this.y * vector.x;
    }
    rotate(alpha){
        var phi = Math.atan2(this.y, this.x)
        var dist = this.norm();
        return Vector2.fromPolar(alpha + phi, dist)
    }
    equals(vector){
        if(this.x == vector.x && this.y == vector.y){
            return true;
        } else {
            return false;
        }
    }
    alpha(){
        return Math.atan2(this.y, this.x)
    }
    static random(){
        return new Vector2(Math.random(), Math.random())
    }
    static randomCenter(max = 1){
        return new Vector2(Math.random()-0.5, Math.random()-0.5).mul(max)
    }
    static fromPolar(alpha, dist){
        return new Vector2(Math.cos(alpha), Math.sin(alpha)).mul(dist)
    }
    static copy(vector){
        return new Vector2(vector.x, vector.y)
    }
}