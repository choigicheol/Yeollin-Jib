import { Request, Response } from "express";
import user from "../../models/user";
import post from "../../models/post";
import post_category from "../../models/post_category";
import category from "../../models/category";
import Sequelize from "sequelize";
import storage from "../../models/storage";
const { or, and, gt, lt } = Sequelize.Op;

const get_user_infinite = async (req: Request, res: Response) => {
  try {
    const id = req.cookies.id; //유저아이디
    const pageNum: any = req.params.id; // page Number
    let offset = 0;
    if (pageNum > 1) {
      offset = 7 * (pageNum - 1);
    }

    const postGet = await post.findAll({
      where: { userId: id },
      order: [["id", "DESC"]],
      attributes: ["id", "title", "address"],
      limit: 8,
      offset: offset,
      include: [
        {
          model: user,
          attributes: ["nickname", "imagePath"],
        },
        {
          model: storage,
          attributes: ["userId"],
        },
        {
          model: post_category,
          required: false,
          attributes: ["categoryId"],
          include: [
            {
              model: category,
              required: false,
              attributes: ["category1", "category2"],
            },
          ],
        },
      ],
    });

    const data = postGet.length; // 게시물 정보 갯수

    if (data !== 8) {
      if (data === 0) {
        return res
          .status(200)
          .send({ message: "더이상 조회할 게시물이 없습니다." });
      }
      return res
        .status(200)
        .send({ postGet, message: "더이상 조회할 게시물이 없습니다." });
    }

    res.status(200).send({ postGet });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "서버 에러 입니다." });
  }
};
export default get_user_infinite;
