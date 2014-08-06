// http://www.cnblogs.com/QLeelulu/archive/2011/09/07/2170204.html

package main
import (
   "http"
   "io"
)
func handler(w http.ResponseWriter, r *http.Request) {
    io.WriteString(w, "Hello, world")
}
func main() {
     http.HandleFunc("/", handler)
     http.ListenAndServe(":8080", nil)
}