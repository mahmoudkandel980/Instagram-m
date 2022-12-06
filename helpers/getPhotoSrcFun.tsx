const capitalSrc = "/images/newUser/capital";
const smallSrc = "/images/newUser/capital";
const src = "/images/newUser/user.jpg";

export function getPhotoSrcFun(userName: string) {
    // small
    if (userName?.startsWith("a")) {
        return `${smallSrc}/a.jpg`;
    } else if (userName?.startsWith("b")) {
        return `${smallSrc}/b.jpg`;
    } else if (userName?.startsWith("c")) {
        return `${smallSrc}/c.jpg`;
    } else if (userName?.startsWith("d")) {
        return `${smallSrc}/d.jpg`;
    } else if (userName?.startsWith("e")) {
        return `${smallSrc}/e.jpg`;
    } else if (userName?.startsWith("f")) {
        return `${smallSrc}/f.jpg`;
    } else if (userName?.startsWith("g")) {
        return `${smallSrc}/g.jpg`;
    } else if (userName?.startsWith("h")) {
        return `${smallSrc}/h.jpg`;
    } else if (userName?.startsWith("i")) {
        return `${smallSrc}/i.jpg`;
    } else if (userName?.startsWith("j")) {
        return `${smallSrc}/j.jpg`;
    } else if (userName?.startsWith("k")) {
        return `${smallSrc}/k.jpg`;
    } else if (userName?.startsWith("l")) {
        return `${smallSrc}/l.jpg`;
    } else if (userName?.startsWith("m")) {
        return `${smallSrc}/m.jpg`;
    } else if (userName?.startsWith("n")) {
        return `${smallSrc}/n.jpg`;
    } else if (userName?.startsWith("o")) {
        return `${smallSrc}/o.jpg`;
    } else if (userName?.startsWith("p")) {
        return `${smallSrc}/p.jpg`;
    } else if (userName?.startsWith("q")) {
        return `${smallSrc}/q.jpg`;
    } else if (userName?.startsWith("r")) {
        return `${smallSrc}/r.jpg`;
    } else if (userName?.startsWith("s")) {
        return `${smallSrc}/s.jpg`;
    } else if (userName?.startsWith("t")) {
        return `${smallSrc}/t.jpg`;
    } else if (userName?.startsWith("u")) {
        return `${smallSrc}/u.jpg`;
    } else if (userName?.startsWith("v")) {
        return `${smallSrc}/v.jpg`;
    } else if (userName?.startsWith("w")) {
        return `${smallSrc}/w.jpg`;
    } else if (userName?.startsWith("x")) {
        return `${smallSrc}/x.jpg`;
    } else if (userName?.startsWith("y")) {
        return `${smallSrc}/y.jpg`;
    } else if (userName?.startsWith("z")) {
        return `${smallSrc}/z.jpg`;
    }
    // capital
    else if (userName?.startsWith("A")) {
        return `${capitalSrc}/A.jpg`;
    } else if (userName?.startsWith("B")) {
        return `${capitalSrc}/B.jpg`;
    } else if (userName?.startsWith("C")) {
        return `${capitalSrc}/C.jpg`;
    } else if (userName?.startsWith("D")) {
        return `${capitalSrc}/D.jpg`;
    } else if (userName?.startsWith("E")) {
        return `${capitalSrc}/E.jpg`;
    } else if (userName?.startsWith("F")) {
        return `${capitalSrc}/F.jpg`;
    } else if (userName?.startsWith("G")) {
        return `${capitalSrc}/G.jpg`;
    } else if (userName?.startsWith("H")) {
        return `${capitalSrc}/H.jpg`;
    } else if (userName?.startsWith("I")) {
        return `${capitalSrc}/I.jpg`;
    } else if (userName?.startsWith("J")) {
        return `${capitalSrc}/J.jpg`;
    } else if (userName?.startsWith("K")) {
        return `${capitalSrc}/K.jpg`;
    } else if (userName?.startsWith("L")) {
        return `${capitalSrc}/L.jpg`;
    } else if (userName?.startsWith("M")) {
        return `${capitalSrc}/M.jpg`;
    } else if (userName?.startsWith("N")) {
        return `${capitalSrc}/N.jpg`;
    } else if (userName?.startsWith("O")) {
        return `${capitalSrc}/O.jpg`;
    } else if (userName?.startsWith("P")) {
        return `${capitalSrc}/P.jpg`;
    } else if (userName?.startsWith("Q")) {
        return `${capitalSrc}/Q.jpg`;
    } else if (userName?.startsWith("R")) {
        return `${capitalSrc}/R.jpg`;
    } else if (userName?.startsWith("S")) {
        return `${capitalSrc}/S.jpg`;
    } else if (userName?.startsWith("T")) {
        return `${capitalSrc}/T.jpg`;
    } else if (userName?.startsWith("U")) {
        return `${capitalSrc}/U.jpg`;
    } else if (userName?.startsWith("V")) {
        return `${capitalSrc}/V.jpg`;
    } else if (userName?.startsWith("W")) {
        return `${capitalSrc}/W.jpg`;
    } else if (userName?.startsWith("X")) {
        return `${capitalSrc}/X.jpg`;
    } else if (userName?.startsWith("Y")) {
        return `${capitalSrc}/Y.jpg`;
    } else if (userName?.startsWith("Z")) {
        return `${capitalSrc}/Z.jpg`;
    } else {
        return src;
    }
}
