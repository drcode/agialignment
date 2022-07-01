(ns agialignment.launcher
  (:require [agialignment.agialignment :as ez]))

(ez/permanent-database!)
(ez/start-server)
