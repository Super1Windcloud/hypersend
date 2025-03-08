# -*- coding: utf-8 -*-
"""
Created on Fri May 14 17:09:46 2021
@author:   FUCK   you
"""

import numpy as np
import matplotlib.pyplot as plt
import time


plt.rcParams['font.sans-serif'] = 'SimHei'

holes =  [  [ 2 ,1  ]  , [5,2  ] , [11,3] , [8,6   ] ,  [ 11,6]  , [ 8,7] ,[8,8] , [1,9],[1,11] , [ 3,10 ] ,[5,12]  ,[11,12] ]  ;

holes =   [  [x[0] -1 ,x[1] -1 ]  for  x  in holes ] ;
num_ants = 50  # 蚂蚁数量
alpha = 1  # 信息素因子[1,4]
beta = 2  # 启发函数因子[0,5]
rho = 0.1  # 信息素挥发因子[0.2,0.5]
iter = 0  # 迭代初始值
num_iterations  = 100  # 最大迭代次数
Q = 1  # 信息素常量
num_holes = len(holes)
distance_matrix = np.zeros((num_holes, num_holes))

for i in range(num_holes):
    for j in range(num_holes):
        distance_matrix[i][j] = abs(holes[i][0] - holes[j][0]) + abs(holes[i][1] - holes[j][1])  # 曼哈顿距离


# 初始信息素矩阵，全是为1组成的矩阵
pheromone_matrix = np.ones((num_holes, num_holes))


def ant_colony_optimization():
    best_path = []
    best_distance = float('inf')

    for iteration in range(num_iterations):
        paths = []
        distances = []

        for ant in range(num_ants):
            path = [0]  # 从原点开始
            distance = 0
            visited = [False] * num_holes
            visited[0] = True

            while len(path) < num_holes:
                current_hole = path[-1]
                next_hole = select_next_hole(current_hole, visited)
                path.append(next_hole)
                visited[next_hole] = True
                distance += distance_matrix[current_hole][next_hole]

            # 返回到原点
            distance += distance_matrix[path[-1]][0]
            path.append(0)
            distances.append(distance)
            paths.append(path)

            if distance < best_distance:
                best_distance = distance
                best_path = path

        update_pheromone(paths, distances)

    return best_path, best_distance


def select_next_hole(current_hole, visited):
    probabilities = []
    total = 0

    for i in range(num_holes):
        if not visited[i]:
            pheromone = pheromone_matrix[current_hole][i] ** alpha
            heuristic = (1 / distance_matrix[current_hole][i]) ** beta
            probabilities.append(pheromone * heuristic)
            total += pheromone * heuristic
        else:
            probabilities.append(0)

    probabilities = [p / total for p in probabilities]
    next_hole = np.random.choice(range(num_holes), p=probabilities)
    return next_hole


def update_pheromone(paths, distances):
    for i in range(num_holes):
        for j in range(num_holes):
            pheromone_matrix[i][j] *= (1 - rho)

    for path, distance in zip(paths, distances):
        for i in range(len(path) - 1):
            pheromone_matrix[path[i]][path[i + 1]] += Q / distance


def  run():
    start_time = time.time()
    best_path, best_distance = ant_colony_optimization()
    end_time = time.time()

    print(f"运行时间: {end_time - start_time} 秒")
    print(f"最短路径距离: {best_distance}")
    print(f"最短路线: {best_path}")
    return best_path, best_distance


def  draw():
    # 绘制电路板
    plt.figure(figsize=(10, 10))
    for hole in holes:
        plt.plot(hole[0], hole[1], 'ro')

    # 绘制路线
    for i in range(len(best_path) - 1):
        start = holes[best_path[i]]
        end = holes[best_path[i + 1]]
        plt.plot([start[0], end[0]], [start[1], end[1]], 'b-')

    plt.title('电路板钻孔最优路径')
    plt.xlabel('X 坐标')
    plt.ylabel('Y 坐标')
    plt.grid(True)
    plt.show()


if  __name__ == "__main__":
     best_path, best_distance = run()
     draw()
