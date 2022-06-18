(ns agialignment.agialignment
  (:require [fbc-utils.debug]
            [super-server.super-server :as ss]
            [agialignment.resolvers :as re]
            [agialignment.twitter :as tw]))

(def db-schema {} #_{:user/userid   :string
                     :user/password :string
                     :task/data     :string
                     :task/userId   :ref
                     })

(defn connection [])

(def graphql-schema {:interfaces {:Node {:fields {:id {:type '(non-null ID)}}}}
                     :objects    {:App  {:implements [:Node]
                                         :fields     {:id    {:type '(non-null ID)}
                                                      #_:tasks #_{:type '(list :Task)
                                                                  :resolve #'re/app-tasks}
                                                      }}
                                  #_:Task #_{:implements [:Node]
                                             :fields     {:id   {:type '(non-null ID)}
                                                          :data {:type 'String}}}}
                     :queries    {:app {:type    :App
                                        :resolve #'re/app}}
                     :mutations  {}
                     #_{:addTask    {:type    :Task
                                     :args    {:data {:type 'String}}
                                     :resolve #'re/add-task}
                        :updateTask {:type    :Task
                                     :args    {:id   {:type '(non-null ID)}
                                               :data {:type 'String}}
                                     :resolve #'re/update-task}
                        :deleteTask {:type    :App
                                     :args    {:id {:type '(non-null ID)}}
                                     :resolve #'re/delete-task}}})

(defn empty-temp-database! []
  (ss/empty-temp-database! db-schema))

(defn permanent-database! []
  (ss/permanent-database! db-schema))

(defn start-server []
  (ss/start-server {:schema         graphql-schema
                    :local-react?   false
                    :port           8892
                    :user-accounts? false})
  :started)

(defn start-server-local-react []
  (ss/start-server {:schema         graphql-schema
                    :local-react?   true
                    :port           8892
                    :user-accounts?  false})
  :started)

;;(empty-temp-database!)
;;(permanent-database!)
;;(start-server-local-react)
;;(start-server)

