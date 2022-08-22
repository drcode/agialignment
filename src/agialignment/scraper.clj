(ns agialignment.scraper
  (:require [etaoin.api :as ea]
            [etaoin.keys :as ek]
            [clojure.java.io :as io]
            [fbc-utils.debug]))

(defonce driver-atom (atom nil))

(defn driver []
  (or @driver-atom (reset! driver-atom (ea/chrome {:headless true}))))

(defn copy [uri file]
  (with-open [in (io/input-stream uri)
              out (io/output-stream file)]
    (io/copy in out)))

(defn fetch-avatar [username]
  #d :heeer
  #d (ea/go (driver) #d (str "https://twitter.com/" username))
  #d (ea/wait-exists (driver) {:css "a[href$='/photo'] img[src]"})
  (let [url #d (ea/get-element-attr (driver) {:css "a[href$='/photo'] img[src]"} :src)]
    #d (copy url (str "resources/public/avatars/" username))))
